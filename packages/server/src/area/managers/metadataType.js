const { models } = require("../../../config/database");

class MetadataTypeAreaManager extends models.Manager {
    async metadataNameById(id) {
        const result = await this.getInstance().findOne({
            attributes: ['name'],
            where: {
                id
            }
        })
        return result !== null ? result.name : null
    }
}

module.exports = MetadataTypeAreaManager