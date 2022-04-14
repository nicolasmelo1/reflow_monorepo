const { models } = require('../../../../palmares/database')

class AppAppManagamentFormularyManager extends models.Manager {
    /**
     * Query for retrieving the app id related to the app uuid.
     * 
     * @param {string} appUUID - The uuid of the app to retrieve.
     * 
     * @returns {Promise<number|null>} - The app id related to the app uuid or null 
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

    /**
     * This is supposed to return the app uuid by a given app id.
     * 
     * @param {number} appId - The id of the app that you want to retrieve the uuid for.
     * 
     * @returns {Promise<number|null>} - The app uuid related to the app id or null if the 
     * app id doesn't exist.
     */
    async uuidByAppId(appId) {
        const result = await this.getInstance().findOne({
            attributes: ['uuid'],
            where: {
                id: appId
            }
        })
        return result !== null ? result.id : null
    }
}

module.exports = AppAppManagamentFormularyManager