const models = require('../../../config/database/models')


class UserAuthenticationManager extends models.Manager {
    /**
     * Retrieves a user by it's username or by it's email.
     * 
     * @param {string} usernameOrEmail - The username or email of the user that you want to retrieve.
     * 
     * @returns {Promise<User | null>} - The user that was retrieved or null if the user does not exist.
     */
    async userByUsernameOrEmail(usernameOrEmail) {
        const { operations } = this.getEngineInstance()
        return await this.getInstance().findOne({
            where: {
                [operations.or]: [
                    {username: usernameOrEmail},
                    {email: usernameOrEmail}
                ]
            }
        })
    }

    /**
     * Retrieves a user by its id.
     * 
     * @param {number} userId - The id of the user to retrieve.
     * 
     * @returns {Promise<User>} - The user object.
     */
     async userById(userId) {
        return await this.getInstance().findOne({
            where: {
                id: userId
            }
        })
    }
}

module.exports = UserAuthenticationManager