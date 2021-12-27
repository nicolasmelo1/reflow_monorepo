/** @module src/authentication/controllers */

const controllers = require('../../../config/controllers')
const status = require('../../../config/status')

const { User } = require('../models')
const { reflowJSONError } = require('../../core/services')
const { JWT } = require('../utils')
const { 
    LoginInputSerializer, 
    LoginOutputSerializer,
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
 * This view uses a temporary password instead of the default password in because of brute force. 
 * If a person wants to brute force a password change for all of the emails there will be no changes for users who hasn't requested it.
 * 
 * The response is always the same independent if it worked or not, so a malicious user can't see which user is valid and which is not valid
 */
class ForgotPasswordController extends controllers.Controller {
    inputSerializer = ForgotPasswordInputSerializer

    /**
     * recieves a json containing the url of the front-end and a email to send a new password.
     */
    async post(req, res, next, transaction) {
        const serializer = new this.inputSerializer({ data: req.body })
        if (await serializer.isValid()) {
            await serializer.toSave(transaction)
        }
        res.status(status.HTTP_200_OK).json({
            status: 'ok'
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
                const newTokenAndRefreshToken = ''
                //const newTokenAndRefreshToken = await UserService.updateRefreshTokenAndUserLastLogin(user.id, transaction)
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
    TestTokenController
}