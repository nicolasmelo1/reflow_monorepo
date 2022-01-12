const { models } = require("../../../config/database")

class FieldNumberAppManagementFormularyManager extends models.Manager {
    /**
     * This will retrieve one field number instance by the given field id.
     * 
     * @param {number} fieldId - The id of the field to retrieve the field number instance to.
     * 
     * @returns {Promise<import('../models').FieldNumber | null>} - The field number instance.
     */
    async fieldNumberByFieldId(fieldId) {
        return await this.getInstance().findOne({
            where: {
                fieldId: fieldId
            }
        })
    }
}

module.exports = FieldNumberAppManagementFormularyManager