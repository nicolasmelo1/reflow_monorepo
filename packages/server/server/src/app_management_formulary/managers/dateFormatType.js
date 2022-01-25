const { models } = require('../../../../palmares/database')

class DateFormatTypeAppManagementFormularyManager extends models.Manager {
    /**
     * This will retrieve all of the dateFormatTypes so we can render and use them on the front end when we load the management application.
     * 
     * @returns {Promise<Array<import('../models').DateFormatType>>} - Returns a promise that will resolve to an array of dateFormatTypes.
     */
    async all() {
        return await this.getInstance().findAll()
    }
}

module.exports = DateFormatTypeAppManagementFormularyManager