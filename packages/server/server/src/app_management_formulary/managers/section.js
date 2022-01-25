const { models } = require('../../../../palmares/database')

class SectionAppManagementFormularyManager extends models.Manager {
    /**
     * Query for retrieving all of the sections by the id of the formulary.
     * 
     * @param {number} formularyId - The id of the formulary to retrieve the sections for.
     * 
     * @returns {Promise<Array<import('../models').Section>>} - All of the sections of a given
     * formularyId.
     */
    async sectionsByFormularyId(formularyId) {
        return await this.getInstance().findAll({
            where: {
                formularyId: formularyId
            }
        })
    }

    /**
     * This will retrieve the uuid of the section from the id of the section.
     * 
     * @param {number} sectionId - The id of the section to retrieve the uuid for.
     * 
     * @returns {Promise<string | null>} - The uuid of the section.
     */
    async sectionUUIDBySectionId(sectionId) {
        const section = await this.getInstance().findOne({
            attributes: ['uuid'],
            where: {
                id: sectionId
            }
        })
        return section !== null ? section.uuid : null
    }
}

module.exports = SectionAppManagementFormularyManager