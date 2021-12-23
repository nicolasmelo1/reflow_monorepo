/** @module src/authentication/utils/jwtAuth */

const { settings } = require('../../../config/conf')

const jsonwebtoken = require('jsonwebtoken')

/**
 * This class is used for JWT handling in our application. There are two use cases to use this class:
 * 
 * 1 - Create a new jwt token (refresh token or authentication token)
 * 2 - validate the jwt token
 * 
 * For the first case this class exposes two methods: `.getToken(userId)` and `.getRefreshToken(userId)`. 
 * For both of them you need to pass the userId argument in order to create a token.
 * Since they are both staticmethods you don't need a object of the class.
 * 
 * For the second case you may want to create a object of this class and then call the method
 * `.extractJWTFromRequest(request)`. Then you need to call `.isValid()` function. 
 * 
 * IMPORTANT:
 * After you call `.isValid()` if your data is valid the `.data` property will contain your data.
 * After you call `.isValid()` if your data IS NOT VALID the `.error` property will contain your errors
 */
class JWT {
    /**
     * @param {string | null} jwt - the jwt token to be validated. Defaults as null.
     */
    constructor(jwt=null) {
        this.jwt = jwt
    }

    /**
     * Checks if the jwt is a valid token, if it is, it appends to `data` the user id. If it is not
     * it appends to `error` the error message.
     * 
     * @returns {number} - the user id from the token.
     */
    isValid() {
        if (this.jwt !== null) {
            try {
                const payload = jsonwebtoken.verify(this.jwt, settings.SECRET_KEY, {
                    algorithms: [settings.JWT_ENCODING]
                })
                this.data = payload
                return true
            } catch (err) {
                if (err.name === 'TokenExpiredError') {
                    this.error = 'expired_token'
                } else if (err.name === 'JsonWebTokenError') {
                    this.error = 'invalid_token'
                } else {
                    this.error = 'unknown_error'
                }
                return false
            }
        } 
        this.error = 'jwt_not_defined'
        return false
    }

    /**
     * Takes out the jwt token from the express request. The token can be either on the header 
     * in the 'Authorization' part or on a query parameter as `token`
     * 
     * @param {Express.Request} req - The request recieved from express
     */
    extractJWTFromRequest(req) {
        const authorization = req.headers['authorization']
        if (authorization) {
            for (const jwtHeaderType of settings.JWT_HEADER_TYPES) {
                this.jwt = authorization.replace(`${jwtHeaderType} `, '')
            }
        } else if (req.query.token) {
            this.jwt = req.query.token
        }
    }
    /**
     * Generates a JSON Web Token that stores this user's ID and has an expiry
     * date set to 24 hours into the future.
     * 
     * @param {number} userId - the user id to be enconded inside of the token.
     * 
     * @returns {string} - the generated token.
     */
    static getToken(userId) {
        const expiryHours = 24
        const expiryDate = new Date()
        expiryDate.setTime(expiryDate.getTime() + expiryHours * 60 * 60 * 1000)

        return jsonwebtoken.sign({
            id: userId,
            exp: parseInt(expiryDate.getTime() / 1000, 10),
            type: 'access'
        }, settings.SECRET_KEY, {
            algorithm: settings.JWT_ENCODING
        })
    }

    /**
     * Generates a JSON Web Token that stores this user's ID and has an expiry
     * date set to 60 days into the future. The user cannot use this token to access resources.
     * 
     * @param {number} userId - the user id to be enconded inside of the token.
     * 
     * @returns {string} - the generated token.
     */
    static getRefreshToken(userId) {
        
        const expiryDays = 60
        const expiryDate = new Date()
        expiryDate.setDate(expiryDate.getDate() + expiryDays)

        return jsonwebtoken.sign({
            id: userId,
            exp: parseInt(expiryDate.getTime() / 1000, 10),
            type: 'refresh'
        }, settings.SECRET_KEY, {
            algorithm: settings.JWT_ENCODING
        })
    }
}


module.exports = JWT