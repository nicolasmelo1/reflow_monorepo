/** @module src/authentication/serializers */

const serializers = require('../../../config/serializers')

const { ReflowValidationError } = require('../../core/serializers')
const { User } = require('../models')
const { JWT } = require('../utils')
const { 
    PasswordService
} = require('../services')
//------------------------------------------------------------------------------
/**
 * Serializer used in the login controller to retrieve the data, validate and authenticate the user.
 */
class LoginInputSerializer extends serializers.Serializer {
    fields = {
        username: new serializers.CharField(),
        password: new serializers.CharField()
    }

    async validate(data) {
        this.user = await User.base.authenticate(data.username, data.password)
        if (this.user === null) {
            throw new ReflowValidationError({reason: 'invalid_pass_or_user', detail: 'Either the user or the password are not valid'})
        }
    }
    /**
     * If the user is valid we will return the refreshToken and the accessToken.
     */
    async save(data) {
        return {
            accessToken: JWT.getToken(this.user.id),
            refreshToken: JWT.getRefreshToken(this.user.id)
        }
    }
}

/**
 * The data needed to be sent after the user made the login and is successfully authenticated in the application.
 */
class LoginOutputSerializer extends serializers.Serializer {
    fields = {
        companyId: new serializers.CharField(),
        accessToken: new serializers.CharField(),
        refreshToken: new serializers.CharField(),
        formName: new serializers.CharField(),
        user: new UserOutputSerializer()
    }
}
//------------------------------------------------------------------------------
/**
 * Serializer used for requesting a new temporary password for the user. We just create a new temporary password
 * if it exists, otherwise we will not change anything.
 */
class ForgotPasswordInputSerializer extends serializers.Serializer {
    fields = {
        email: new serializers.CharField(),
        changePasswordUrl: new serializers.CharField()
    }

    async save(data, transaction) {
        await PasswordService.requestNewTemporaryPasswordForUser(transaction, data.email, data.changePasswordUrl)
    }
}
//------------------------------------------------------------------------------
/**
 * Used for validating if the temporary password is valid for the user to change the password
 * if it is then we proceed to change the user password, otherwise we will not change anything.
 */
class ChangePasswordInputSerializer extends serializers.Serializer {
    fields = {
        temporaryPassword: new serializers.CharField(),
        password: new serializers.CharField()
    }

    async validate(data) {
        this.passwordService = new PasswordService()
        const isValid = await this.passwordService.isValidTemporaryPassword(data.temporaryPassword)
        if (!isValid) {
            throw new ReflowValidationError({
                reason: 'invalid_temporary_password', 
                detail: 'The temporary password supplied is not valid. You should request the temporary password again.'
            })
        }
    }

    async save(data, transaction) {
        await this.passwordService.changePassword(data.password, transaction)
    }

}
//------------------------------------------------------------------------------
/**
 * Serializer used for sending the new accessToken and the new refreshToken requested by the user after expiring
 * the old accessToken.
 */
class RefreshTokenOutputSerializer extends serializers.Serializer {
    fields = {
        accessToken: new serializers.CharField(),
        refreshToken: new serializers.CharField()
    }
}

module.exports = {
    LoginInputSerializer,
    LoginOutputSerializer,
    ForgotPasswordInputSerializer,
    ChangePasswordInputSerializer,
    RefreshTokenOutputSerializer,
}