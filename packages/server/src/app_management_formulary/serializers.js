const serializers = require('../../config/serializers')
const { NumberFormatType, DateFormatType, TimeFormatType, FieldType, SectionType, Formulary } = require('./models')
const { 
    NumberFormatTypeRelation , 
    DateFormatTypeRelation, 
    TimeFormatTypeRelation, 
    FieldTypeRelation, 
    SectionTypeRelation,
    SectionRelation
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
            sectionType: await SectionType.APP_MANAGEMENT_FORMULARY.all()
        }
        return await super.toRepresentation(data)
    }

    fields = {
        numberFormatType: new NumberFormatTypeRelation({ many: true }),
        dateFormatType: new DateFormatTypeRelation({ many: true }),
        timeFormatType: new TimeFormatTypeRelation({ many: true }),
        fieldType: new FieldTypeRelation({ many: true }),
        sectionType: new SectionTypeRelation({ many: true })
    }
}

/**
 * The formulary serializer will retrieve the data needed to build the formulary, all of the sections with
 * all of the fields it have. With this data we are able to build the formulary to display and render it to the user.
 */
class FormularyOutputSerializer extends serializers.ModelSerializer {
    fields = {
        sections: new SectionRelation({ source: 'id', many: true }),
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