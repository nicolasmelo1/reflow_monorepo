/** @module src/authentication/serializers */

const serializers = require('../../../../palmares/serializers')

const { ReflowValidationError } = require('../../core/serializers')
const { WorkspaceRelation } = require('../relations')
const { User } = require('../models')
const { UserService } = require('../services')
const { JWT } = require('../utils')
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
        this.user = await UserService.authenticate(data.username, data.password)
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
        accessToken: new serializers.CharField(),
        refreshToken: new serializers.CharField(),
    }
}
//------------------------------------------------------------------------------
/**
 * This serializer is used to send the actual user data to the client. This represent the logged in user.
 */
class MeOutputSerializer extends serializers.ModelSerializer {
    fields = {
        workspaces: new WorkspaceRelation({ source: 'id', many: true })
    }
    
    options = {
        model: User,
        exclude: ['isSuperuser', 'isStaff', 'tempPassword', 'password']
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
    MeOutputSerializer,
    RefreshTokenOutputSerializer,
}