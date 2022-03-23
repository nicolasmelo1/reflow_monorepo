const { models } = require('../../../../palmares/database')

class FormularyFieldsAppManagementFormularyManager extends models.Manager {
    /**
     * This will retrieve all of the field ids of a formulary by the given formulary id.
     * 
     * @param {number} formularyId - The id of the formulary to retrieve the fields for.
     * 
     * @returns {Promise<Array<import('../models').Field>>} - An array with all of the fields 
     * of the formulary.
     */
     async fieldIdsByFormularyId(formularyId) {
        return (await this.getInstance().findAll({
            attributes: ['fieldId'],
            where: {
                formularyId: formularyId
            }
        })).map(formularyField => formularyField.fieldId)
    }
}

module.exports = FormularyFieldsAppManagementFormularyManager