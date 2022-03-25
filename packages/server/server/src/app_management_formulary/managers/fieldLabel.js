const { models } = require('../../../../palmares/database')

class FieldLabelAppManagementFormularyManager extends models.Manager {
    async fieldLabelByFieldLabelId(fieldLabelId) {
        return await this.getInstance().findOne({
            where: {
                id: fieldLabelId
            }
        })
    }
}

module.exports = FieldLabelAppManagementFormularyManager