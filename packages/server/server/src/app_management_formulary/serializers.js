const serializers = require('../../../palmares/serializers')

const FieldService = require('./services/field')
const { 
    NumberFormatType, DateFormatType, TimeFormatType, 
    FieldType, Field, Formulary, FormularyFields 
} = require('./models')
const { 
    NumberFormatTypeRelation , 
    DateFormatTypeRelation, 
    TimeFormatTypeRelation, 
    FieldTypeRelation, 
    FieldRelation
} = require('./relations')

/**
 * Serializer used for retrieving each type that is needed to build the formulary.
 * If you for some reason, add new types then you should add it here for us to be able to use it
 * on the front end.
 */
class TypeOutputSerializer extends serializers.Serializer {
    async toRepresentation() {
        const data = {
            numberFormatType: await NumberFormatType.APP_MANAGEMENT_FORMULARY.all(),
            dateFormatType: await DateFormatType.APP_MANAGEMENT_FORMULARY.all(),
            timeFormatType: await TimeFormatType.APP_MANAGEMENT_FORMULARY.all(),
            fieldType: await FieldType.APP_MANAGEMENT_FORMULARY.all(),
        }
        return await super.toRepresentation(data)
    }

    fields = {
        numberFormatType: new NumberFormatTypeRelation({ many: true }),
        dateFormatType: new DateFormatTypeRelation({ many: true }),
        timeFormatType: new TimeFormatTypeRelation({ many: true }),
        fieldType: new FieldTypeRelation({ many: true }),
    }
}

/**
 * The formulary serializer will retrieve the data needed to build the formulary, all of the sections with
 * all of the fields it have. With this data we are able to build the formulary to display and 
 * render it to the user.
 */
class FormularyOutputSerializer extends serializers.ModelSerializer {
    async toRepresentation() {
        const isInstanceAnObject = typeof this.instance === 'object'
        if (isInstanceAnObject) {
            const { uuid } = this.instance
            const formularyId = await Formulary.APP_MANAGEMENT_FORMULARY.formularyIdByUUID(uuid)
            const fieldIds = await FormularyFields.APP_MANAGEMENT_FORMULARY.fieldIdsByFormularyId(formularyId)
            const unorderedFields = await Field.APP_MANAGEMENT_FORMULARY.fieldsByFieldIds(fieldIds)
            const orderedFields = await FieldService.reorderFieldsByArrayOfOrderedFieldIds(unorderedFields, fieldIds)

            let fieldsData = []
            for (const field of orderedFields) {
                fieldsData.push({
                    ...field,
                    formularyUUID: uuid
                })
            }
            const data = {
                ...this.instance,
                fields: fieldsData
            }
            return await super.toRepresentation(data)
        } else {
            return await super.toRepresentation(this.instance)
        }
    }

    fields = {
        fields: new FieldRelation({ source: 'id', many: true }),
    }
    
    options = {
        model: Formulary,
        fields: ['uuid', 'name', 'labelName']
    }
}

module.exports = {
    TypeOutputSerializer,
    FormularyOutputSerializer
}