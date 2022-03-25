const { models } = require('../../../../palmares/database')

class FieldTypeCategoryTypeAppManagementFormularyManager extends models.Manager {
    async fieldCategoryTypeNameByCategoryTypeId(categoryTypeId) {
        const result = await this.getInstance().findOne({
            attributes: ['name'],
            where: {
                id: categoryTypeId
            }
        })
        return typeof result === 'object' ? result.name : null
    }
}

module.exports = FieldTypeCategoryTypeAppManagementFormularyManager