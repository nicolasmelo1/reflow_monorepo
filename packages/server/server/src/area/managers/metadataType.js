const { models } = require("../../../../palmares/database");

class MetadataTypeAreaManager extends models.Manager {
    /**
     * Query for retrieving the metadata type name by the metadata type id.
     * 
     * @param {number} metadataTypeId - The id of the metadata type to find the name for.
     * 
     * @returns {Promise<string | null>} - The name of the metadata type.
     */
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