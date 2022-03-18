const { deepCopy } = require('../../../../../shared/utils') 

class FieldService {
    /**
     * This is a a helper function to order an array of fields based on a particular ordering.
     * 
     * @param {Array<{id: number}>} fields - This is an array of objects that MUST have the `id` defined, it can have
     * other data in it.
     * @param {Array<number>} arrayOfOrderedFieldIds - An array of the order to consider of field ids. The order of the array
     * is the ordering that we will respect.
     * 
     * @param {Array<{id: number}>} - The `fields` array ordered.
     */
    static async reorderFieldsByArrayOfOrderedFieldIds(fields, arrayOfOrderedFieldIds) {
        fields = deepCopy(fields)
        const fieldsByFieldId = {}
        const fieldsOrdered = []
        for (const fieldId of arrayOfOrderedFieldIds) {
            let fieldToAddInOrder = fieldsByFieldId[fieldId] 
            const doesFieldIdExistInFieldsByFieldId = fieldToAddInOrder !== undefined
            if (doesFieldIdExistInFieldsByFieldId === false) {
                // We cannot remove elements from an array inside of a loop, so what we do is simple:
                // as we loop we add `fieldIndexToRemove`, this variable will hold the number of elements to be 
                // removed from index 0. For example in the array ['elemento', 'elemento2', 'elemento3'], if `fieldIndexToRemove` is 1
                // we remove 'elemento' and 'elemento2' ending up with the array like ['elemento3']
                let fieldIndexToRemove = 0
                for (let i=0; i < fields.length; i++) {
                    const field = fields[i]
                    fieldsByFieldId[field.id] = field
                    const isFieldTheSameFieldWeAreSearchingFor = field.id.toString() === fieldId.toString()
                    if (isFieldTheSameFieldWeAreSearchingFor) {
                        fieldToAddInOrder = field
                        break
                    }
                    fieldIndexToRemove = i
                }
                fields.splice(0, fieldIndexToRemove + 1)
            }
            
            const isFieldToAddInOrderDefined = fieldToAddInOrder !== undefined
            if (isFieldToAddInOrderDefined) fieldsOrdered.push(fieldToAddInOrder)
        }

        return fieldsOrdered
    }
}

module.exports = FieldService