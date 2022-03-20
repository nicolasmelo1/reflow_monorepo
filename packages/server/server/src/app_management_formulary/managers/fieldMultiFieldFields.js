const { models } = require('../../../../palmares/database')

class FieldMultiFieldFieldsAppManagementFormularyManager extends models.Manager {
    async fieldIdsByFieldMultiFieldId(fieldMultiFieldId) {
        return (await this.getInstance().findAll({
            attributes: ['fieldId'],
            where: {
                fieldMultiFieldId
            }
        })).map(fieldMultiField => fieldMultiField.fieldId)
    }
}

module.exports = FieldMultiFieldFieldsAppManagementFormularyManager