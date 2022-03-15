const { models } = require("../../../../palmares/database")

class FieldAppManagementFormularyManager extends models.Manager {
    /**
     * This will retrieve all of the fields of a section by the given section id.
     * 
     * @param {number} sectionId - The id of the section to retrieve the fields for.
     * 
     * @returns {Promise<Array<import('../models').Field>>} - An array with all of the fields 
     * of the section.
     */
    async fieldsBySectionId(sectionId) {
        return await this.getInstance().findAll({
            where: {
                sectionId: sectionId
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