const { models } = require('../../../../palmares/database')

class AvailableAppAreaManager extends models.Manager {
    async availableAppByAvailableAppId(availableAppId) {
        return await this.getInstance().findOne({
            where: {
                id: availableAppId
            }
        })
    }
}

module.exports = AvailableAppAreaManager