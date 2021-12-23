/** @module src/authentication/services/permissions */


const { ProfileType } = require('../models')

/**
 * Check for `src/core/permissions.js` to understand how permissions are defined and how it is used.
 * This is the service so it will handle all the business logic side of it.
 */
class AuthenticationPermissionsService {
    /**
     * Checks if a given company is valid, if it is let it pass through, if not throw an error.
     * 
     * @param {Company} company - A Company engine instance to check if it's valid.
     * 
     * @returns {Promise<boolean>} - Returns a promise that resolves to true if the company is valid, false if not.
     */
    static async isValidCompany(company) {
        if (![null, undefined].includes(company) && company.isActive === true) {
            return true
        }
        return false
    }

    /**
     * Checks if a given user is valid for it's given company, if it is let it pass, if not throw an error.
     * 
     * @param {Company} company - A Company engine instance to check if it's valid.
     * @param {User} user - A User engine instance to check if it's valid for the given company.
     * 
     * @returns {Promise<boolean>} - Returns a promise that resolves to true if the user is valid, false if not.
     */
    static async isValidUserCompany(company, user) {
        if (![null, undefined].includes(company) && ![null, undefined].includes(user) && user.companyId === company.id) {
            return true
        }
        return false
    }

    /**
     * Checks if a given user is valid for it's profile, this is for handling just admin routes, if the user is not
     * an admin, the permission will fail.
     * 
     * @param {User} user - A User engine instance to check if it's valid for the given company.
     * 
     * @returns {Promise<boolean>} - Returns a promise that resolves to true if the user is an admin, false if not.
     */
    static async isValidAdminOnlyPath(user) {
        const profileTypeAdminId = (await ProfileType.AUTHENTICATION.profileIdOfAdmin())?.id
        if (user.profileId === profileTypeAdminId) {
            return true
        }
        return false
    }
}

module.exports = AuthenticationPermissionsService