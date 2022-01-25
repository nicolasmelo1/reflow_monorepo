const { models } = require('../../../../palmares/database')

class FieldDateAppManagementFormularyManager extends models.Manager {
    /**
     * This will retrieve one field date instance by the given field id.
     * 
     * @param {number} fieldId - The id of the field to retrieve the field date instance to.
     * 
     * @returns {Promise<import('../models').FieldDate | null>} - The field date instance.
     */
    async fieldDateByFieldId(fieldId) {
        return await this.getInstance().findOne({
            where: {
                fieldId: fieldId
            }
        })
    }
}

module.exports = FieldDateAppManagementFormularyManager