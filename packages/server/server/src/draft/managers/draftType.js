const { models } = require("../../../../palmares/database") 


class DraftTypeDraftManager extends models.Manager {
    /**
     * This is used to retrieve the id of the draft type 'file'.
     * 
     * @returns {Promise<number>} - The id of the draft type 'file'.
     */
    async fileDraftTypeId() {
        const result = await this.getInstance().findOne({
            attributes: ['id'],
            where: {
                name: 'file'
            }
        })
        return result?.id ? result.id : null
    }

    /**
     * This is used to retrieve the id of the draft type 'value'.
     * 
     * @returns {Promise<number>} - The id of the draft type 'value'.
     */
    async valueDraftTypeId() {
        const result = await this.getInstance().findOne({
            attributes: ['id'],
            where: {
                name: 'value'
            }
        })
        return result?.id ? result.id : null
    }
}

module.exports = DraftTypeDraftManager