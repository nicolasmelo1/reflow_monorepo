/** @module src/authentication/services/password */


const { User } = require('../models')
const { JWT } = require('../utils')

/**
 * Service responsible for handling passwords of the users inside of reflow.
 */
class PasswordService {
    /**
     * Requests a new temporary password for the user, if the user email exists, sends a email notification   
     * 
     * @param {object} transaction - The transaction object   
     * @param {string} email - The email of the user
     * @param {string} changePasswordUrl - The url to change the password
     * @param {string} companyName - If the email is a welcome email. Send the companyName to send in the email
     */
    static async requestNewTemporaryPasswordForUser(transaction, email, changePasswordUrl, companyName=null){
        // search on username column instead of email column, username is always unique
        const user = await User.AUTHENTICATION.userIdActiveByEmail(email)
        if (user !== null) {
            const userId = user.id
            const temporaryPassword = JWT.getToken(userId)
            await User.AUTHENTICATION.createTemporaryPasswordForUser(userId, temporaryPassword, transaction)
            changePasswordUrl = changePasswordUrl.replace(/{}/g, temporaryPassword)
            if (companyName !== null) {
                //NotifyService.sendWelcomeEmail(user.email, temporaryPassword, companyName, changePasswordUrl)
            } else {
                //NotifyService.sendChangePassword(user.email, user.first_name, temporary_password, url)
            }   
        }
    }

    /**
     * Validates if a temporary password is valid before changing the old password to the new password
     * 
     * @param {string} temporaryPassword - temporary password, must be the jwt temporary password recieved
     */
    async isValidTemporaryPassword(temporaryPassword) {
        const jwt = new JWT(temporaryPassword)
        if (jwt.isValid()) {
            this.userId = jwt.data.id
            return await User.AUTHENTICATION.existsUserByUserIdAndTemporaryPassword(this.userId, temporaryPassword)
        } else {
            return false
        }
    }
    /**
     * Changes the user password based on a jwt token recieved
     * 
     * @param {sting} newPassword - The new password to be saved in the database
     */
    async changePassword(newPassword, transaction){
        if (this.userId === undefined) {
            throw new AssertionError('Call first `.isValidTemporaryPassword()` to validate your temporary password and ' + 
                                     'after that, call `.changePassword()` method to change the password.')
        } else {
            await User.AUTHENTICATION.changeUserPassword(this.userId, newPassword, transaction)
        }
    }
}

module.exports = PasswordService