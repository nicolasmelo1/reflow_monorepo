const models = require('../../../../palmares/database/models')


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

    /**
     * Updates the lastLogin of the user since we do not change it directly.
     * 
     * @param {number} userId - The id of the user to update the lastLogin for.
     * @param {object} transaction - The transaction to use in the query. 
     * 
     * @returns {Promise<Array<number, number>>} - The promise returns an array with one or two elements. 
     * The first element is always the number of affected rows, while the second element is the actual affected rows.
     */
    async updateUserLastLogin(userId, transaction) {
        return await this.getInstance().update({
            lastLogin: new Date()
        }, {
            where: {
                id: userId,
            },
            transaction: transaction
        })
    }
}

module.exports = UserAuthenticationManager