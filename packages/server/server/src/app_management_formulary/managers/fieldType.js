const { models } = require('../../../../palmares/database')

class FieldTypeAppManagementFormularyManager extends models.Manager {
    /**
     * This will return all of the field types. The field types will hold all of the types of fields that are available for the user for
     * selection. Each field will have obligatorily a field type. So we can know how to render the field and also what type of data
     * that can be saved.
     * 
     * @returns {Promise<Array<import('../models').FieldType>>} - Returns a promise that will resolve to an array of field types.
     */
    async all() {
        return await this.getInstance().findAll()
    }
}

module.exports = FieldTypeAppManagementFormularyManager