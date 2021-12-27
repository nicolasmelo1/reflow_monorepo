const { checkPassword } = require('../../../config/authentication/security')

const { User } = require('../models')


/**
 * Service responsible for managing everything about users inside of reflow.
 */
class UserService {
    /**
     * @param {number} userId - The user id that is managing the users
     */
    constructor(userId) {
        this.userId = parseInt(userId)
    }

    /**
     * This will authenticate the user and return the user if the user exists and the password is correct,
     * otherwise we will return null.
     * 
     * This is a custom authentication function because we want to be able to authenticate the user from it's
     * username or email.
     * 
     * @param {string} usernameOrEmail - The username or email of the user that is trying to authenticate.
     * @param {string} password - The password of the user that is trying to authenticate. This is the rawPassword
     * not the encoded one. The encoded will exist in the database and we will use `checkPassword` to check if
     * both passwords are equal or not.
     * 
     * @returns {Promise<User | null>} - The user that tried to authenticate or null if the password is not correct
     * or if the user does not exist.
     */
    static async authenticate(usernameOrEmail, password) {
        const user = await User.AUTHENTICATION.userByUsernameOrEmail(usernameOrEmail)
        if (user) {
            const isValidPassword = checkPassword(password, user.password)
            if (isValidPassword) {
                return user
            }
        }
        return null
    }
    
}

module.exports = UserService