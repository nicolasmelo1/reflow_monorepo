const serializers = require("../../../palmares/serializers")
const { 
    NumberFormatType, 
    DateFormatType, 
    TimeFormatType, 
    FieldType, 
    Field,
    FieldAttachment,
    FieldConnection,
    FieldUser,
    FieldNumber,
    FieldDate,
    FieldFormula,
    FieldFormulaVariable,
    FieldOption,
    FieldTags,
    Option,
    FieldLabel,
    FieldMultiField,
    FieldMultiFieldFields,
    FieldTypeCategoryType
} = require('./models')
const FieldService = require("./services/field")

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

const categoryTypeNameByIdCache = {}
/**
 * This relation will be used for retrieving the types of the formulary. The types will be the first thing that
 * we retrieve and we will use it to render the formulary. You can see all of the possible field types in the
 * FieldType model jsDoc. This will explain all of the possible field types that we can have in the application at 
 * the present time.
 */
class FieldTypeRelation extends serializers.ModelSerializer {
    async toRepresentation(fieldTypesData) {
        /**
         * Used for retrieving the category type name by the category type id.
         * Since we can have many calls to the same data we cache it in memory.
         * 
         * @param {number} categoryTypeId - The if of the category type to retrieve
         * 
         * @returns {Promise<string>} - The name of the category type id.
         */
        async function getCategoryTypeName(categoryTypeId) {
            const doesCategoryTypeNameExistInCache = categoryTypeNameByIdCache[categoryTypeId] !== undefined
            if (doesCategoryTypeNameExistInCache === false) {
                categoryTypeNameByIdCache[categoryTypeId] = await FieldTypeCategoryType.APP_MANAGEMENT_FORMULARY.fieldCategoryTypeNameByCategoryTypeId(categoryTypeId)
            } 
            return categoryTypeNameByIdCache[categoryTypeId]
        }
        
        const isFieldTypesDataAnArray = Array.isArray(fieldTypesData) && this.many === true
        let newFieldTypesData = isFieldTypesDataAnArray ? [] : {}

        if (isFieldTypesDataAnArray) {
            for (const fieldTypeData of fieldTypesData) {
                const newFieldTypeData = {
                    ...fieldTypeData,
                    categoryTypeName: await getCategoryTypeName(fieldTypeData.categoryId)
                }
                newFieldTypesData.push(newFieldTypeData)
            }
        } else {
            newFieldTypesData = {
                ...fieldTypesData,
                categoryTypeName: await getCategoryTypeName(fieldTypesData.categoryId)
            } 
        }

        return super.toRepresentation(newFieldTypesData)
    }

    fields = {
        categoryTypeName: new serializers.CharField()
    }

    options = {
        model: FieldType,
        exclude: ['order', 'categoryId']
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

/** 
 * This relation is used for retrieving the variables of a specific formula. The variables are fields that will have it's values used inside of the formula.
 */
class FieldFormulaVariableRelation extends serializers.ModelSerializer {
    async toRepresentation(fieldFormulaId) {
        const fieldFormulaVariables = await FieldFormulaVariable.APP_MANAGEMENT_FORMULARY.uuidsVariableIdAndOrderByFieldFormulaId(fieldFormulaId)
        const data = []
        // The ordering here is important, that's why we don't use Promise.all.
        for (const { uuid, variableId, order} of fieldFormulaVariables) {
            const fieldUUID = await Field.APP_MANAGEMENT_FORMULARY.uuidByFieldId(variableId)
            data.push({
                uuid,
                variableUUID: fieldUUID,
                order
            })
        }
        return await super.toRepresentation(data)
    }

    fields = {
        variableUUID: new serializers.UUIDField()
    }

    options = {
        model: FieldFormulaVariable,
        exclude: ['id', 'fieldFormulaId', 'variableId']
    }
}

class FieldFormulaRelation extends serializers.ModelSerializer {
    async toRepresentation(fieldId) {
        const fieldFormula = await FieldFormula.APP_MANAGEMENT_FORMULARY.fieldFormulaByFieldId(fieldId)
        const doesFieldFormulaDataExists = fieldFormula !== null
        if (doesFieldFormulaDataExists) {
            return await super.toRepresentation(fieldFormula)
        } else {
            return undefined
        }
    }

    fields = {
        variables: new FieldFormulaVariableRelation({ source: 'id', many: true })
    }

    options = {
        model: FieldFormula,
        exclude: ['id', 'fieldId']
    }
}

class FieldMultiFieldsRelation extends serializers.ModelSerializer {
    async toRepresentation(fieldId) {
        const [fieldUUID, fieldMultiField] = await Promise.all([
            Field.APP_MANAGEMENT_FORMULARY.uuidByFieldId(fieldId),
            FieldMultiField.APP_MANAGEMENT_FORMULARY.fieldMultiFieldsByFieldId(fieldId)
        ])
        const doesFieldMultiFieldsDataExists = fieldMultiField !== null
        if (doesFieldMultiFieldsDataExists) {
            const fieldIds = await FieldMultiFieldFields.APP_MANAGEMENT_FORMULARY.fieldIdsByFieldMultiFieldId(fieldMultiField.id)
            const unorderedFields = await Field.APP_MANAGEMENT_FORMULARY.fieldsByFieldIds(fieldIds)
            const orderedFields = await FieldService.reorderFieldsByArrayOfOrderedFieldIds(unorderedFields, fieldIds)
            const orderedFieldsWithContext = orderedFields.map(field => {
                return {
                    ...field,
                    context: {
                        name: 'multi_field',
                        metadata: fieldUUID
                    }
                }
            })
            const data = {
                ...fieldMultiField,
                fields: orderedFieldsWithContext
            }
            return await super.toRepresentation(data)
        } else {
            return undefined
        }
    }   

    fields = {
        fields: new serializers.LazyField({ field: FieldRelation, many: true })
    }

    options = {
        model: FieldMultiField,
        exclude: ['id', 'fieldId']
    }
}

class FieldDateRelation extends serializers.ModelSerializer {
    async toRepresentation(fieldId) {
        const fieldDate = await FieldDate.APP_MANAGEMENT_FORMULARY.fieldDateByFieldId(fieldId)
        const doesFieldDateDataExists = typeof fieldDate === 'object'
        if (doesFieldDateDataExists) {
            return await super.toRepresentation(fieldDate)
        } else {
            return undefined
        }
    }

    options = {
        model: FieldDate,
        exclude: ['id', 'fieldId']
    }
}

class FieldNumberRelation extends serializers.ModelSerializer {
    async toRepresentation(fieldId) {
        const fieldNumber = await FieldNumber.APP_MANAGEMENT_FORMULARY.fieldNumberByFieldId(fieldId)
        const doesFieldNumberDataExists = typeof fieldNumber === 'object'
        if (doesFieldNumberDataExists) {
            return await super.toRepresentation(fieldNumber) 
        } else {
            return undefined
        }
    }

    options = {
        model: FieldNumber,
        exclude: ['id', 'fieldId']
    }
}

class FieldUserRelation extends serializers.ModelSerializer {
    async toRepresentation(fieldId) {
        const fieldUser = await FieldUser.APP_MANAGEMENT_FORMULARY.fieldUserByFieldId(fieldId)
        const doesFieldUserDataExists = typeof fieldUser === 'object'
        if (doesFieldUserDataExists) {
            return await super.toRepresentation(fieldUser)
        } else {
            return undefined
        }
    }

    options = {
        model: FieldUser,
        exclude: ['id', 'fieldId']
    }
}

class FieldConnectionRelation extends serializers.ModelSerializer {
    async toRepresentation(fieldId) {
        const fieldConnection = await FieldConnection.APP_MANAGEMENT_FORMULARY.fieldConnectionByFieldId(fieldId)
        const doesFieldConnectionDataExists = typeof fieldConnection === 'object'
        if (doesFieldConnectionDataExists) {
            return await super.toRepresentation(fieldConnection)
        } else {
            return undefined
        }
    }

    options = {
        model: FieldConnection,
        exclude: ['id', 'fieldId']
    }
}

class FieldAttachmentRelation extends serializers.ModelSerializer {
    async toRepresentation(fieldId) {
        const fieldAttachment = await FieldAttachment.APP_MANAGEMENT_FORMULARY.fieldAttachmentByFieldId(fieldId)
        const doesFieldAttachmentDataExists = typeof fieldAttachment === 'object'
        if (doesFieldAttachmentDataExists) {
            return await super.toRepresentation(fieldAttachment)
        } else {
            return undefined
        }
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
 * The label is used to define the label value of the field. This is because sometimes what we will only use is the label.
 * Some fields cannot have values attached to it. So that's exactly why we have the label defined like this.
 */
class FieldLabelRelation extends serializers.ModelSerializer {
    async toRepresentation(labelId) {
        const fieldLabel = await FieldLabel.APP_MANAGEMENT_FORMULARY.fieldLabelByFieldLabelId(labelId)
        return await super.toRepresentation(fieldLabel)
    }

    options = {
        model: FieldLabel,
        exclude: ['id']
    }
}

/**
 * This relation is used to give the context of the field. The problem is:
 * Right now a field is independent, this means it could live inside of a field, inside of a formulary, and who knows where else
 * the field can exist.
 * Because of this we need a way to know where the field is located. So we therefore can save the field from a single url. 
 * It can be Properly validated (instead of using url params our query params) and we have a slick and simple api to use.
 * So this means that whenever you are sending the field data to the user you need to send the field context.
 */
class FieldContextRelation extends serializers.Serializer {
    fields = {
        name: new serializers.ChoiceField({ choices: ['formulary', 'multi_field']}),
        metadata: new serializers.CharField()
    }
}

/**
 * This will render each field of the formulary that is inside of a particular formulary id.
 * As said in the FieldConnection, FieldDate and other models like that we also bound the field to specific field 
 * type models, so we can hold the data for this particular field type.
 */
class FieldRelation extends serializers.ModelSerializer {
    fields = {
        label: new FieldLabelRelation({ source: 'labelId' }),
        context: new FieldContextRelation(),
        multiFieldsField: new FieldMultiFieldsRelation({ source: 'id', required: false, allowNull: true }),
        attachmentField: new FieldAttachmentRelation({ source: 'id', required: false, allowNull: true }),
        connectionField: new FieldConnectionRelation({ source: 'id', required: false, allowNull: true }),
        userField: new FieldUserRelation({ source: 'id', required: false, allowNull: true }),
        numberField: new FieldNumberRelation({ source: 'id', required: false, allowNull: true }),
        dateField: new FieldDateRelation({ source: 'id', required: false, allowNull: true }),
        formulaField: new FieldFormulaRelation({ source: 'id', required: false, allowNull: true }),
        optionField: new FieldOptionRelation({ source: 'id', required: false, allowNull: true }),
        tagsField: new FieldTagsRelation({ source: 'id', required: false, allowNull: true }),
        options: new OptionRelation({ source: 'id', many: true, required: false })
    }

    options = {
        model: Field,
        exclude: ['id', 'createdAt', 'updatedAt', 'labelId']
    }
}

module.exports = {
    NumberFormatTypeRelation,
    DateFormatTypeRelation,
    TimeFormatTypeRelation,
    FieldTypeRelation,
    FieldRelation
}