const { models } = require("../../../../palmares/database")

class FieldAppManagementFormularyManager extends models.Manager {
    /**
     * This will retrieve all of the fields by an array of fieldIds
     * 
     * @param {Array<number>} fieldIds - The array of the id of the fields to retrieve the fields for.
     * 
     * @returns {Promise<Array<import('../models').Field>>} - An array with all of the fields 
     * of the list of fields.
     */
    async fieldsByFieldIds(fieldIds) {
        return await this.getInstance().findAll({
            where: {
                id: fieldIds
            }
        })
    }

    /**
     * Retrieves the uuid of the field by the given field id if it exists.
     * 
     * @param {number} fieldId - The id of the field to retrieve the uuid for.
     * 
     * @returns {Promise<string | null>} - The uuid of the field or null if the field doesn't exist.
     */
    async uuidByFieldId(fieldId) {
        const result = await this.getInstance().findOne({
            where: {
                id: fieldId
            },
            attributes: ['uuid']
        })
        return result !== null ? result.uuid : null
    }
}

module.exports = FieldAppManagementFormularyManager