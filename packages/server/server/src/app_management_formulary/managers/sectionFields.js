const { models } = require('../../../../palmares/database')

class SectionFieldsAppManagementFormularyManager extends models.Manager {
    /**
     * This will retrieve all of the field ids of a section by the given section id.
     * 
     * @param {number} sectionId - The id of the section to retrieve the fields for.
     * 
     * @returns {Promise<Array<import('../models').Field>>} - An array with all of the fields 
     * of the section.
     */
     async fieldIdsBySectionId(sectionId) {
        return (await this.getInstance().findAll({
            attributes: ['fieldId'],
            where: {
                sectionId: sectionId
            }
        })).map(sectionField => sectionField.fieldId)
    }
}

module.exports = SectionFieldsAppManagementFormularyManager