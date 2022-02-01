/** @module src/authentication/controllers */

const controllers = require('../../../../palmares/controllers')
const status = require('../../../../palmares/status')

const { User } = require('../models')
const { UserService } = require('../services') 
const { reflowJSONError } = require('../../core/services')
const { JWT } = require('../utils')
const { 
    LoginInputSerializer, 
    LoginOutputSerializer,
    MeOutputSerializer,
    TypeOutputSerializer,
    RefreshTokenOutputSerializer
} = require('../serializers')

//------------------------------------------------------------------------------
/**
 * Handles the login of the user in reflow, this gives the user 
 * the access token and the refresh token.
 */
class LoginController extends controllers.Controller {
    inputSerializer = LoginInputSerializer
    outputSerializer = LoginOutputSerializer

    /**
     * Authenticate the user based on email or username and login.
     * If login information is valid we return to him the jwt tokens.
     */
    async post(req, res, next) {   
        const serializer = new this.inputSerializer({ data: req.body })
        if (await serializer.isValid()) {
            const { accessToken, refreshToken } = await serializer.toSave()
            req.user = serializer.user
            
            if (req.user !== null) {
                const responseSerializer = new this.outputSerializer({
                    instance: {
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    }
                })
                return res.status(status.HTTP_200_OK).json({
                    status: 'ok',
                    data: await responseSerializer.toRepresentation()
                })
            }
        } 
        const error = serializer.error()
        return res.status(status.HTTP_403_FORBIDDEN).json({
            status: 'error',
            error: reflowJSONError({
                reason: error.errorKey ? error.errorKey : error.reason,
                detail: error.detail ? error.detail : error.reason,
                metadata: error.fieldName ? { fieldName: error.fieldName } : {}
            })
        })
    }
}
//------------------------------------------------------------------------------
/**
 * This controller will return the data about the logged in user itself. All it's workspaces, his name, his id
 * and anything needed to be displayed in the application.
 */
class MeController extends controllers.Controller {
    outputSerializer = MeOutputSerializer
    
    async get(req, res) {
        const serializer = new this.outputSerializer({ instance: req.user })
        return res.status(status.HTTP_200_OK).json({
            status: 'ok',
            data: await serializer.toRepresentation()
        })
    }
}
//------------------------------------------------------------------------------
/**
 * Controller responsible for retrieving the types for the authentication app. This types are stuff like the profile type
 * the location type (with all of the possible locations we can have this application in) and so on. The idea of this types
 * is to get it before retrieving the data about the user. With this we are able to know if the user is an admin, or what type
 * of access does the user have.
 */
class TypeController extends controllers.Controller {
    outputSerializer = TypeOutputSerializer

    /**
     * This will retrieve the authentication types, responsible for knowing the profile of the user and all the information needed
     * to understand better the user/company.
     */
    async get(req, res) {
        const serializer = new this.outputSerializer()
        return res.status(status.HTTP_200_OK).json({
            status: 'ok',
            data: await serializer.toRepresentation()
        })
    }
}
//------------------------------------------------------------------------------
/**
 * Controller that refreshes a token and sends a new token and a new refresh token to the user.
 * This is also responsible for updating the lastLogin of the user since the user stays logged in 
 * for a long time.
 */
class RefreshTokenController extends controllers.Controller {
    outputSerializer = RefreshTokenOutputSerializer

    /**
     * You need to send the refresh token in the header in order to recieve a new token
     * and a new refresh token
     */
    async get(req, res, next, transaction) {
        const jwt = new JWT()
        jwt.extractJWTFromRequest(req)

        if (jwt.isValid()) {
            const user = await User.AUTHENTICATION.userById(jwt.data.id)
            if (user !== null && jwt.data.type === 'refresh') {
                const newTokenAndRefreshToken = await UserService.updateRefreshTokenAndUserLastLogin(user.id, transaction)
                const responseSerializer = new this.outputSerializer({
                    instance: newTokenAndRefreshToken
                })
                return res.status(status.HTTP_200_OK).json({
                    status: 'ok',
                    data: await responseSerializer.toRepresentation()
                })
            } else {
                return res.status(status.HTTP_403_FORBIDDEN).json({
                    status: 'error',
                    error: reflowJSONError({
                        reason: 'must_be_refresh_token_or_user_does_not_exist',
                        detail: 'You are passing an access token but it should be a refreshToken. Otherwise the user encoded on the token does not exist.'
                    })
                })
            }
        } else {
            return res.status(status.HTTP_403_FORBIDDEN).json({
                status: 'error',
                error: reflowJSONError({
                    reason: jwt.error,
                    detail: 'The token is not valid'
                })
            })
        }
    }
}
//------------------------------------------------------------------------------
/**
 * Simple controller just used to validate if a token is still valid or not.
 */
class TestTokenController extends controllers.Controller {
    /**
     * We don't validate the token here, we validate using jwtRequiredMiddleware(), we just return a ok response
     */
    async get(req, res, next) {
        return res.status(status.HTTP_200_OK).json({
            status: 'ok'
        })
    }
}

module.exports = {
    LoginController,
    RefreshTokenController,
    TestTokenController,
    MeController,
    TypeController
}