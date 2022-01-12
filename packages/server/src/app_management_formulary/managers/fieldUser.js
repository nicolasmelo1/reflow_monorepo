const { models } = require("../../../config/database")

class FieldUserAppManagementFormularyManager extends models.Manager {
    /**
     * This will retrieve one field user instance by the given field id.
     * 
     * @param {number} fieldId - The id of the field to retrieve the field user instance to.
     * 
     * @returns {Promise<import('../models').FieldUser | null>} - The field user instance.
     */
    async fieldUserByFieldId(fieldId) {
        return await this.getInstance().findOne({
            where: {
                fieldId: fieldId
            }
        })
    }
}

module.exports = FieldUserAppManagementFormularyManager