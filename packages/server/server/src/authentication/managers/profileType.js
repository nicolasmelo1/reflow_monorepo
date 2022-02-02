const models = require('../../../../palmares/database/models')

class ProfileTypeAuthenticationManger extends models.Manager {
    /**
     * Retrieves all of the profiles from the database. The profiles defines if the user is an admin, a collaborator, an editor or whatever.
     * 
     * @returns {Promise<Array<import('../models').ProfileType>>} - An array of profile types.
     */
    async all() {
        return await this.getInstance().findAll()
    }

    /**
     * Retrieves the id of the admin profile type.
     * 
     * @returns {Promise<number>} - The id of the admin profile type.
     */
    async adminProfileTypeId() {
        const result = await this.getInstance().findOne({ 
            attributes: ['id'],
            where: { 
                name: 'admin' 
            } 
        })
        return result ? result.id : null
    }
}

module.exports = ProfileTypeAuthenticationManger