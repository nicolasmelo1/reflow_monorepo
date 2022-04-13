const { models } = require('../../../../palmares/database')

class AppTypeAreaManager extends models.Manager {
    /**
     * This will retrieve all of the appTypes so we can render and use them on the 
     * front end when we load the management application.
     * 
     * @returns {Promise<Array<import('../models').AppType>>} - Returns a promise that 
     * will resolve to an array of appTypes.
     */
     async all() {
        return await this.getInstance().findAll()
    }
}

module.exports = AppTypeAreaManager