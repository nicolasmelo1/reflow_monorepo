const serializers = require("../../config/serializers");
const { 
    NumberFormatType, 
    DateFormatType, 
    TimeFormatType, 
    FieldType, 
    SectionType, 
    Section, 
    Field,
    FieldConnection,
    FieldUser,
    FieldNumber
} = require('./models')


class NumberFormatTypeRelation extends serializers.ModelSerializer {
    options = {
        model: NumberFormatType,
        exclude: ['order']
    }
}

class DateFormatTypeRelation extends serializers.ModelSerializer {
    options = {
        model: DateFormatType,
        exclude: ['order']
    }
}

class TimeFormatTypeRelation extends serializers.ModelSerializer {
    options = {
        model: TimeFormatType,
        exclude: ['order']
    }
}

class FieldTypeRelation extends serializers.ModelSerializer {
    options = {
        model: FieldType,
        exclude: ['order']
    }
}

class SectionTypeRelation extends serializers.ModelSerializer {
    options = {
        model: SectionType,
        exclude: ['order']
    }
}

// ------------------------------------------------------------------------------------------

class FieldNumberRelation extends serializers.ModelSerializer {
    async toRepresentation(fieldId) {
        const fieldNumber = await FieldNumber.APP_MANAGEMENT_FORMULARY.fieldNumberByFieldId(fieldId)
        return await super.toRepresentation(fieldNumber)
    }

    options = {
        model: FieldNumber,
        fields: ['fieldId']
    }
}

class FieldUserRelation extends serializers.ModelSerializer {
    async toRepresentation(fieldId) {
        const fieldUser = await FieldUser.APP_MANAGEMENT_FORMULARY.fieldUserByFieldId(fieldId)
        return await super.toRepresentation(fieldUser)
    }

    options = {
        model: FieldUser,
        exclude: ['fieldId']
    }
}

class FieldConnectionRelation extends serializers.ModelSerializer {
    async toRepresentation(fieldId) {
        const fieldConnection = await FieldConnection.APP_MANAGEMENT_FORMULARY.fieldConnectionByFieldId(fieldId)
        return await super.toRepresentation(fieldConnection)
    }

    options = {
        model: FieldConnection,
        exclude: ['fieldId']
    }
}

class FieldRelation extends serializers.ModelSerializer {
    async toRepresentation(sectionId) {
        const fields = await Field.APP_MANAGEMENT_FORMULARY.fieldsBySectionId(sectionId)
        return await super.toRepresentation(fields)
    }

    fields = {
        sectionUUID: new serializers.UUIDField(),
        connectionField: new FieldConnectionRelation({ source: 'id' }),
        userField: new FieldUserRelation({ source: 'id' }),
        numberField: new FieldNumberRelation({ source: 'id' }),
        dateField: new FieldDateRelation({ source: 'id' }),
        formulaField: new FieldFormulaRelation({ source: 'id' })
    }

    options = {
        model: Field,
        exclude: ['order', 'createdAt', 'updatedAt', 'sectionId']
    }
}

class SectionRelation extends serializers.ModelSerializer {
    async toRepresentation(formularyId) {
        const sections = await Section.APP_MANAGEMENT_FORMULARY.sectionsByFormularyId(formularyId)
        return await super.toRepresentation(sections)
    }

    fields = {
        fields: new FieldRelation({ source: 'id', many: true }),
    }

    options = {
        model: Section,
        fields: ['uuid', 'name', 'labelName', 'order', 'sectionTypeId']
    }
}

module.exports = {
    NumberFormatTypeRelation,
    DateFormatTypeRelation,
    TimeFormatTypeRelation,
    FieldTypeRelation,
    SectionTypeRelation,
    SectionRelation
}