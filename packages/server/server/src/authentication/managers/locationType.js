const models = require('../../../../palmares/database/models')

class LocationTypeAuthenticationManger extends models.Manager {
    /**
     * Retrieves all of the location types from the database. The location will define the location where the user is using
     * the application.
     * 
     * @returns {Promise<Array<import('../models').LocationType>>} - An array of profile types.
     */
    async all() {
        return await this.getInstance().findAll()
    }
}

module.exports = LocationTypeAuthenticationManger