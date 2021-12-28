const { models } = require("../../../config/database")

class AppAreaManager extends models.Manager {
    async appsByAreaId(areaId) {
        return await this.getInstance().findAll({
            where: {
                areaId: areaId
            }
        })
    }
}

module.exports = AppAreaManager