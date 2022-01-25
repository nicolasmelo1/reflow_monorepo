const { models } = require("../../../../palmares/database");

class TimeFormatTypeAppManagementFormularyManager extends models.Manager {
    /**
     * This will get all of the timeFormatTypes so we can use it to render the time on the front end as the user has chosen.
     * 
     * @returns {Promise<Array<import('../models').TimeFormatType>>} - Returns a promise that will resolve to an array of timeFormatTypes.
     */
    async all() {
        return await this.getInstance().findAll()
    }
}

module.exports = TimeFormatTypeAppManagementFormularyManager