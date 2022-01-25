const { models } = require('../../../../palmares/database')

class OptionAppManagementFormularyManager extends models.Manager {
    /**
     * Retrieves all of the options from a given fieldId.
     * 
     * @param {number} fieldId - The id of the field to retrieve the options for.
     * 
     * @returns {Promise<Array<import('../models').Option>>} - An array with all of the options
     * of the given fieldId.
     */
    async optionsByFieldId(fieldId) {
        return await this.getInstance().findAll({
            where: {
                fieldId: fieldId
            }
        })
    }
}

module.exports = OptionAppManagementFormularyManager