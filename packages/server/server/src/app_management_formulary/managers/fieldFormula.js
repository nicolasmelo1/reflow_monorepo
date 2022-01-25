const { models } = require('../../../../palmares/database')

class FieldFormulaAppManagementFormularyManager extends models.Manager {
    /**
     * This will retrieve one field formula instance by the given field id.
     * 
     * @param {number} fieldId - The id of the field to retrieve the field formula instance to.
     * 
     * @returns {Promise<import('../models').FieldFormula | null>} - The field formula instance.
     */
    async fieldFormulaByFieldId(fieldId) {
        return await this.getInstance().findOne({
            where: {
                fieldId: fieldId
            }
        })
    }
}

module.exports = FieldFormulaAppManagementFormularyManager