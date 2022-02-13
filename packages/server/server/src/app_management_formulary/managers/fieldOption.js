const { models } = require('../../../../palmares/database')


class FieldOptionAppManagementFormularyManager extends models.Manager {
    /**
     * This will retrieve one field option instance by the given field id.
     * 
     * @param {number} fieldId - The id of the field to retrieve the field option instance to.
     * 
     * @returns {Promise<import('../models').FieldOption | null>} - The field option instance.
     */
    async fieldOptionByFieldId(fieldId) {
        return await this.getInstance().findOne({
            where: {
                fieldId: fieldId
            }
        })
    }
}

module.exports = FieldOptionAppManagementFormularyManager