/** @module src/authentication/serializers */

const serializers = require('../../../../palmares/serializers')

const { strings } = require('../../core/utils')
const { ReflowValidationError } = require('../../core/serializers')
const { 
    WorkspaceRelation,
    ProfileTypeRelation,
    LocationTypeRelation
} = require('../relations')
const {
    User, 
    ProfileType, 
    LocationType 
} = require('../models')
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
            throw new ReflowValidationError({
                reason: 'invalid_pass_or_user', 
                detail: strings(this.context.language, 'loginInvalidPassOrUserError')
            })
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
 * Serializer that holds the types needed for the authentication, in other words, what is needed for the authentication in order to fully
 * understand the permissions of the user inside of the application. Without this information the user will not be able to effectively use 
 * the platform.
 */
class TypeOutputSerializer extends serializers.Serializer {
    async toRepresentation() {
        const data = {
            profileType: await ProfileType.AUTHENTICATION.all(),
            locationType: await LocationType.AUTHENTICATION.all()
        }
        return await super.toRepresentation(data)
    }

    fields = {
        profileType: new ProfileTypeRelation({ many: true }),
        locationType: new LocationTypeRelation({ many: true })
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
    TypeOutputSerializer,
    RefreshTokenOutputSerializer,
}