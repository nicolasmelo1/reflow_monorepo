const { models } = require("../../../config/database");

class SectionTypeAppManagementFormularyManager extends models.Manager {
    /**
     * Right now we will always need sections, if the section is of type `unique` then we will load just one time the section.
     * Otherwise, if the section is of type `multiple` then we will load the section multiple times as many times as the user wants.
     * 
     * @returns {Promise<Array<import('../models').SectionType>>} - Returns a promise that will resolve to an array of sectionTypes.
     */
    async all() {
        return await this.getInstance().findAll()
    }
}

module.exports = SectionTypeAppManagementFormularyManager