const { models } = require('../../../../palmares/database')

class FieldConnectionAppManagementFormularyManager extends models.Manager {
    /**
     * This will retrieve one field connection instance by the given field id.
     * 
     * @param {number} fieldId - The id of the field to retrieve the field connection instance to.
     * 
     * @returns {Promise<import('../models').FieldConnection | null>} - The field connection instance.
     */
    async fieldConnectionByFieldId(fieldId) {
        return await this.getInstance().findOne({
            where: {
                fieldId: fieldId
            }
        })
    }
}

module.exports = FieldConnectionAppManagementFormularyManager