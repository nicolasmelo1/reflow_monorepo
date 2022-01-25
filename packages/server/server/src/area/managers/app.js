const { models } = require('../../../../palmares/database')

class AppAreaManager extends models.Manager {
    /**
     * Retreives all of the apps in a given area by the area's id.
     * 
     * @param {number} areaId - The area's id to retrieve the apps for.
     * 
     * @returns {Promise<Array<import('../models').App>>} - The apps in the given area.
     */
    async appsByAreaId(areaId) {
        return await this.getInstance().findAll({
            where: {
                areaId: areaId
            }
        })
    }

    /**
     * Retrieves the app related to an app's uuid and the area's id.
     * 
     * @param {number} areaId - The id of the area where this app resides.
     * @param {string} appUUID - The uuid of the app to retrieve.
     * 
     * @returns {Promise<import('../models').App>} - The app with the given uuid and area's id.
     */
    async appByAreaIdAndAppUUID(areaId, appUUID) {
        return await this.getInstance().findOne({
            where: {
                areaId: areaId,
                uuid: appUUID
            }
        })
    }
}

module.exports = AppAreaManager