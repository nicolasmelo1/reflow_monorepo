const { models } = require('../../../../palmares/database')

class AppAppManagamentFormularyManager extends models.Manager {
    /**
     * Query for retrieving the app id related to the app uuid.
     * 
     * @param {string} appUUID - The uuid of the app to retrieve.
     * 
     * @returns {Promise<number | null>} - The app id related to the app uuid or null 
     * if the app doesn't exist.
     */
    async appIdByAppUUID(appUUID) {
        const result = await this.getInstance().findOne({
            attributes: ['id'],
            where: {
                uuid: appUUID
            }
        })
        return result !== null ? result.id : null
    }
}

module.exports = AppAppManagamentFormularyManager