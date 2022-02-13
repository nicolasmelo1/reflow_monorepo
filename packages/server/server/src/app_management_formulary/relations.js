const serializers = require("../../../palmares/serializers")
const { 
    NumberFormatType, 
    DateFormatType, 
    TimeFormatType, 
    FieldType, 
    SectionType, 
    Section, 
    Field,
    FieldAttachment,
    FieldConnection,
    FieldUser,
    FieldNumber,
    FieldDate,
    FieldFormula,
    FieldOption,
    FieldTags,
    Option
} = require('./models')

// ------------------------------------------------------------------------------------------
/**
 * This relation will be used for retrieving the types of the formulary. The types will be the first thing that
 * we retrieve and we will use it to render the formulary. This relations if for the number formating.
 */
class NumberFormatTypeRelation extends serializers.ModelSerializer {
    options = {
        model: NumberFormatType,
        exclude: ['order']
    }
}

/**
 * This relation will be used for retrieving the types of the formulary. The types will be the first thing that
 * we retrieve and we will use it to render the formulary. This relation will retrieve all of the possible options
 * for the date formatting.
 */
class DateFormatTypeRelation extends serializers.ModelSerializer {
    options = {
        model: DateFormatType,
        exclude: ['order']
    }
}

/**
 * This relation will be used for retrieving the types of the formulary. The types will be the first thing that
 * we retrieve and we will use it to render the formulary. This will retrieve the time format, is it 24h or 12h 
 * hour format?
 */
class TimeFormatTypeRelation extends serializers.ModelSerializer {
    options = {
        model: TimeFormatType,
        exclude: ['order']
    }
}

/**
 * This relation will be used for retrieving the types of the formulary. The types will be the first thing that
 * we retrieve and we will use it to render the formulary. You can see all of the possible field types in the
 * FieldType model jsDoc. This will explain all of the possible field types that we can have in the application at 
 * the present time.
 */
class FieldTypeRelation extends serializers.ModelSerializer {
    options = {
        model: FieldType,
        exclude: ['order']
    }
}

/**
 * This relation will be used for retrieving the types of the formulary. The types will be the first thing that
 * we retrieve and we will use it to render the formulary. We have 2 possible section types at the present time,
 * each of them will have different behaviours. On one the fields are displayed normally, just one time, on the second
 * one we will repeat the section as many times as needed.
 */
class SectionTypeRelation extends serializers.ModelSerializer {
    options = {
        model: SectionType,
        exclude: ['order']
    }
}

// ------------------------------------------------------------------------------------------
class FieldOptionRelation extends serializers.ModelSerializer {
    async toRepresentation(fieldId) {
        const fieldOption = await FieldOption.APP_MANAGEMENT_FORMULARY.fieldOptionByFieldId(fieldId)
        return await super.toRepresentation(fieldOption)
    }

    options = {
        model: FieldOption,
        exclude: ['id', 'order']
    }
}

class FieldTagsRelation extends serializers.ModelSerializer {
    async toRepresentation(fieldId) {
        const fieldTags = await FieldTags.APP_MANAGEMENT_FORMULARY.fieldTagsByFieldId(fieldId)
        return await super.toRepresentation(fieldTags)
    }

    options = {
        model: FieldTags,
        exclude: ['id', 'order']
    }
}

class FieldFormulaRelation extends serializers.ModelSerializer {
    async toRepresentation(fieldId) {
        const fieldFormula = await FieldFormula.APP_MANAGEMENT_FORMULARY.fieldFormulaByFieldId(fieldId)
        return await super.toRepresentation(fieldFormula)
    }

    options = {
        model: FieldFormula,
        exclude: ['id', 'fieldId']
    }
}

class FieldDateRelation extends serializers.ModelSerializer {
    async toRepresentation(fieldId) {
        const fieldDate = await FieldDate.APP_MANAGEMENT_FORMULARY.fieldDateByFieldId(fieldId)
        return await super.toRepresentation(fieldDate)
    }

    options = {
        model: FieldDate,
        exclude: ['id', 'fieldId']
    }
}

class FieldNumberRelation extends serializers.ModelSerializer {
    async toRepresentation(fieldId) {
        const fieldNumber = await FieldNumber.APP_MANAGEMENT_FORMULARY.fieldNumberByFieldId(fieldId)
        return await super.toRepresentation(fieldNumber)
    }

    options = {
        model: FieldNumber,
        exclude: ['id', 'fieldId']
    }
}

class FieldUserRelation extends serializers.ModelSerializer {
    async toRepresentation(fieldId) {
        const fieldUser = await FieldUser.APP_MANAGEMENT_FORMULARY.fieldUserByFieldId(fieldId)
        return await super.toRepresentation(fieldUser)
    }

    options = {
        model: FieldUser,
        exclude: ['id', 'fieldId']
    }
}

class FieldConnectionRelation extends serializers.ModelSerializer {
    async toRepresentation(fieldId) {
        const fieldConnection = await FieldConnection.APP_MANAGEMENT_FORMULARY.fieldConnectionByFieldId(fieldId)
        return await super.toRepresentation(fieldConnection)
    }

    options = {
        model: FieldConnection,
        exclude: ['id', 'fieldId']
    }
}

class FieldAttachmentRelation extends serializers.ModelSerializer {
    async toRepresentation(fieldId) {
        const fieldAttachment = await FieldAttachment.APP_MANAGEMENT_FORMULARY.fieldAttachmentByFieldId(fieldId)
        return await super.toRepresentation(fieldAttachment)
    }

    options = {
        model: FieldAttachment,
        exclude: ['id', 'fieldId']
    }
}

/**
 * Relation for holding all of the options for `option` or `tag` field types. Other field types
 * can hold the options also but you be sure to explain it to future developers.
 */
class OptionRelation extends serializers.ModelSerializer {
    async toRepresentation(fieldId) {
        const options = await Option.APP_MANAGEMENT_FORMULARY.optionsByFieldId(fieldId)
        return await super.toRepresentation(options)
    }

    options = {
        model: Option,
        exclude: ['id', 'createdAt', 'updatedAt', 'fieldId']
    }
}

/**
 * This will render each field of the formulary that is inside of a particular section id.
 * As said in the FieldConnection, FieldDate and other models like that we also bound the field to specific field 
 * type models, so we can hold the data for this particular field type.
 */
class FieldRelation extends serializers.ModelSerializer {
    async toRepresentation(sectionId) {
        const fields = await Field.APP_MANAGEMENT_FORMULARY.fieldsBySectionId(sectionId)
        let data = []
        for (const field of fields) {
            const sectionUUID = await Section.APP_MANAGEMENT_FORMULARY.sectionUUIDBySectionId(sectionId)
            data.push({
                ...field,
                sectionUUID: sectionUUID
            })
        }
        return await super.toRepresentation(data)
    }

    fields = {
        sectionUUID: new serializers.UUIDField(),
        attachmentField: new FieldAttachmentRelation({ source: 'id' }),
        connectionField: new FieldConnectionRelation({ source: 'id' }),
        userField: new FieldUserRelation({ source: 'id' }),
        numberField: new FieldNumberRelation({ source: 'id' }),
        dateField: new FieldDateRelation({ source: 'id' }),
        formulaField: new FieldFormulaRelation({ source: 'id' }),
        optionField: new FieldOptionRelation({ source: 'id' }),
        tagsField: new FieldTagsRelation({ source: 'id' }),
        options: new OptionRelation({ source: 'id', many: true })
    }

    options = {
        model: Field,
        exclude: ['id', 'order', 'createdAt', 'updatedAt', 'sectionId']
    }
}

/**
 * This will be used for retrieving all of the sections of the formulary. Sections here are simple and are just needed
 * to hold and display the fields of the formulary.
 */
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