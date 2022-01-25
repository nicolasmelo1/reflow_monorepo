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
}

module.exports = FieldAppManagementFormularyManager