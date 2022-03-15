const { models } = require('../../../../palmares/database')


class FieldFormulaVariableAppManagementFormularyManager extends models.Manager {
    /**
     * This query will retrieve all of the formula variables by a given fieldFormulaId. The variables are tied to the fieldFormulaId because
     * they are SPECIFIC for the formula field type. The variables itself are variables are fields that are tied to the formula.
     * 
     * @param {number} fieldFormulaId - The id of the `FieldFormula` instance to retrieve the variables for.
     * 
     * @returns {Promise<{uuid: string, variableId: number, order: number}>}
     */
    async uuidsVariableIdAndOrderByFieldFormulaId(fieldFormulaId) {
        return await this.getInstance().findAll({
            attributes: ['uuid', 'variableId', 'order'],
            where: {
                fieldFormulaId
            }
        })
    }
}

module.exports = FieldFormulaVariableAppManagementFormularyManager