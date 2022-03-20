const { models } = require('../../../../palmares/database')

class FieldMultiFiedsAppManagementFormularyManager extends models.Manager {
    /**
     * This will retrieve one field multi_fields instance by the given field id.
     * 
     * @param {number} fieldId - The id of the field to retrieve the field multi_fields instance to.
     * 
     * @returns {Promise<import('../models').FieldFormula | null>} - The field multi_fields instance.
     */
    async fieldMultiFieldsByFieldId(fieldId) {
        return await this.getInstance().findOne({
            where: {
                fieldId: fieldId
            }
        })
    }
}

module.exports = FieldMultiFiedsAppManagementFormularyManager