const { models } = require("../../../config/database")

class AppConfigurationAreaManager extends models.Manager {
    async valuesAndMetadataIdsByAppId(appId) {
        return await this.getInstance().findAll({
            attributes: ['value', 'metadataId'],
            where: {
                appId: appId
            }
        })
    }
}

module.exports = AppConfigurationAreaManager