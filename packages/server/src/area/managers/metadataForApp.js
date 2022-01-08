const { models } = require("../../../config/database");

class MetadataForAppAreaManager extends models.Manager {
    async metadataTypeIdDefaultValueAndNameByMetadataIdAndAvailableAppId(id, availableAppId) {
        return await this.getInstance().findOne({
            attributes: ['metadataTypeId', 'defaultValue', 'name'],
            where: {
                id,
                availableAppId
            }
        })
    }
}

module.exports = MetadataForAppAreaManager