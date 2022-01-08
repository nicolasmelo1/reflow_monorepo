const { models } = require("../../../config/database")

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