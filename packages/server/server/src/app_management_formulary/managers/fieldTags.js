const { models } = require('../../../../palmares/database')


class FieldTagsAppManagementFormularyManager extends models.Manager {
    /**
     * This will retrieve one field tags instance by the given field id.
     * 
     * @param {number} fieldId - The id of the field to retrieve the field tags instance to.
     * 
     * @returns {Promise<import('../models').FieldOption | null>} - The field tags instance.
     */
    async fieldTagsByFieldId(fieldId) {
        return await this.getInstance().findOne({
            where: {
                fieldId: fieldId
            }
        })
    }
}

module.exports = FieldTagsAppManagementFormularyManager