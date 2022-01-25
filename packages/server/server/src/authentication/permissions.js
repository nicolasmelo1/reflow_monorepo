/** @module src/authentication/permissions */

const { Permission, PermissionsError } = require('../core/permissions')

const { User, Company } = require('./models')
const { AuthenticationPermissionsService } = require('./services')

/**
 * @class AuthenticationPermissions
 * 
 * @description Check `src/core/permissions.js` to understand how we handle permissions in relow.
 */
class AuthenticationDefaultPermission extends Permission {
    init(req) {
        if (![null, undefined].includes(req.user) || req.params?.companyId !== undefined || req.params.userId) return true
        else return false
    }
    
    async handle(req) {
        let user = req.user
        if ([null, undefined].includes(req.user) && req.params.userId) {
            user = await User.AUTHENTICATION.userById(req.params.userId)
        }
        
        if (user === null) {
            throw new PermissionsError({reason: 'not_permitted'})
        }

        if (req.options?.adminOnly && !await AuthenticationPermissionsService.isValidAdminOnlyPath(user)) {
            throw new PermissionsError({reason: 'not_permitted'})
        }

        if (req.params?.companyId !== undefined) {
            const company = await Company.AUTHENTICATION.companyById(req.params.companyId)
            if (!await AuthenticationPermissionsService.isValidCompany(company) || 
                !await AuthenticationPermissionsService.isValidUserCompany(company, user)) {
                throw new PermissionsError({reason: 'not_permitted'})
            }
        }
    }
}


module.exports = {
    AuthenticationDefaultPermission
}