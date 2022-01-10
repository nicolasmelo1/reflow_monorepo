const { models } = require("../../../config/database");

class NumberFormatTypeAppManagementFormularyManager extends models.Manager {
    /**
     * Retrieves all of the numberFormatTypes so we can render and use them on the front end when we load the management application.
     * 
     * @returns {Promise<Array<import('../models').NumberFormatType>>} - Returns a promise that will resolve to an array of numberFormatTypes.
     */
    async all() {
        return await this.getInstance().findAll()
    }
}

module.exports = NumberFormatTypeAppManagementFormularyManager