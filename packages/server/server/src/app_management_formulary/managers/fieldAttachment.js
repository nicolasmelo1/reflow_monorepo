const { models } = require('../../../../palmares/database')

class FieldAttachmentAppManagementFormularyManager extends models.Manager {
    /**
     * This will retrieve one field attachment instance by the given field id.
     * 
     * @param {number} fieldId - The id of the field to retrieve the field attachment instance to.
     * 
     * @returns {Promise<import('../models').FieldAttachment | null>} - The field attachment instance.
     */
    async fieldAttachmentByFieldId(fieldId) {
        return await this.getInstance().findOne({
            where: {
                fieldId: fieldId
            }
        })
    }
}

module.exports = FieldAttachmentAppManagementFormularyManager