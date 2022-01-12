const { models } = require("../../../config/database")

class FormularyAppManagementFormularyManager extends models.Manager {
    /**
     * This will retrieve the formulary by it's app id. Really simple stuff.
     * 
     * @param {number} appId - The app id to retrieve the formulary for.
     * 
     * @returns {Promise<import('../models').Formulary | null>} - The formulary related to the app id.
     */
    async formularyByAppId(appId) {
        return await this.getInstance().findOne({
            where: {
                appId: appId
            }   
        })
    }
}

module.exports = FormularyAppManagementFormularyManager