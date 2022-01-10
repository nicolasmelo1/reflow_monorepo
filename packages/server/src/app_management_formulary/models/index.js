const { models } = require('../../../config/database')

const { 
    FieldTypeAppManagementFormularyManager, 
    TimeFormatTypeAppManagementFormularyManager, 
    DateFormatTypeAppManagementFormularyManager, 
    NumberFormatTypeAppManagementFormularyManager,
    SectionTypeAppManagementFormularyManager
} = require('../managers') 

/**
 * This model is a type, it contains all of the data needed in order to build the management app.
 * 
 * By default we have two section types:
 * - unique - This will create just one section, the fields will NOT be repeated.
 * - multiple - This will create multiple sections, the fields can be repeated over and over. That's the hole idea. This specially useful
 * to create `historico` in sales.
 */
class SectionType extends models.Model {
    attributes = {
        name: new models.fields.CharField({ dbIndex: true }),
        order: new models.fields.IntegerField({ defaultValue: 1 })
    }

    options = {
        ordering: ['order'],
        tableName: 'section_type'
    }

    static APP_MANAGEMENT_FORMULARY = new SectionTypeAppManagementFormularyManager()
}

/**
 * This model is a type, it contains all of the data needed in order to build the management app.
 * 
 * We have the following types at the moment:
 * - text - This is just a basic text field. Nothing much.
 * - number - This is a number field, it can be a decimal, integer or even a currency.
 * - date - This is a date field, it can be a date, time or datetime.
 * - option - This is a select field, it can be a select, radio or checkbox.
 * - long_text - This is a textarea field, it will hold a text longer than the text field. It will be longer than one line.
 * - connection - This is a special field type, it will be used to connect to another management app.
 * - attachment - This is a special field type, it will be used to upload files.
 * - email - Similar to a text field type, except that we will validate emails, and we can also use it for other stuff like
 * sending emails to users in automations.
 * - id - With this we will create an id for the record that was created automatically.
 * - user - With this field type the user can select other users.
 * - formula - This field type is a special one, the user will not be able to set anything, instead he will write a formula so when he saves
 * the record, we will calculate the value of this field.
 * - tags - Similar to a `option` field type, except that we will be able to set multiple tags instead of just one.
 */
class FieldType extends models.Model {
    attributes = {
        name: new models.fields.CharField({ dbIndex: true }),
        order: new models.fields.IntegerField({ defaultValue: 1 })
    }

    options = {
        ordering: ['order'],
        tableName: 'field_type'
    }

    static APP_MANAGEMENT_FORMULARY = new FieldTypeAppManagementFormularyManager()
}

/**
 * The number format type is a type, it contains all of the data needed in order to build the management app.
 * 
 * We have the following types at the moment:
 * - currency - We will use it to format the currency for the user. The currency adds a thousand separator and a decimal separator only to 2 decimal places.
 * - percentage - The percentage is a special format, all of the numbers saved in this field will be divided by 100 and then multiplied by the value of the field.
 * - integer - Only allows integers without any formating to the number.
 * - dynamic - This a special case for formulas, we need it in order to save numbers in formulas since they will be calculated and we don't want to lose precision
 * and the data that is saved.
 */
class NumberFormatType extends models.Model {
    attributes = {
        name: new models.fields.CharField({ dbIndex: true }),
        order: new models.fields.IntegerField({ defaultValue: 1 }),
        precision: new models.fields.BigIntegerField({ defaultValue: 1 }),
        prefix: new models.fields.CharField({ defaultValue: null, allowNull: true, maxLength: 250 }),
        suffix: new models.fields.CharField({ defaultValue: null, allowNull: true, maxLength: 250 }),
        thousandsSeparator: new models.fields.BooleanField({ defaultValue: false }),
        decimalSeparator: new models.fields.BooleanField({ defaultValue: false }),
        base: new models.fields.BigIntegerField({ defaultValue: 1 })
    }

    options = {
        ordering: ['order'],
        tableName: 'number_format_type'
    }

    static APP_MANAGEMENT_FORMULARY = new NumberFormatTypeAppManagementFormularyManager()
}

/**
 * The time format type is a type, it contains all of the data needed in order to build the management app.
 * 
 * For time we have 2 options:
 * 
 * - twenty_four_hours - This will show the time in 24 hours format.
 * - twelve_hours - This will show the time in 12 hours format.
 */
class TimeFormatType extends models.Model {
    attributes = {
        name: new models.fields.CharField({ dbIndex: true }),
        order: new models.fields.IntegerField({ defaultValue: 1 })
    }

    options = {
        ordering: ['order'],
        tableName: 'time_format_type'
    }

    static APP_MANAGEMENT_FORMULARY = new TimeFormatTypeAppManagementFormularyManager()
}

/**
 * The date format type is a type, it contains all of the data needed in order to build the management app.
 * 
 * For date we have 3 possible options:
 * 
 * - local - This will show the date in the local format of the user.
 * - iso - This will show the date in the ISO format.
 * - friendly - This will show the date in a friendly format, for example: 1/1/2020 will be January 1, 2020.
 */
class DateFormatType extends models.Model {
    attributes = {
        name: new models.fields.CharField({ dbIndex: true }),
        order: new models.fields.IntegerField({ defaultValue: 1 })
    }

    options = {
        ordering: ['order'],
        tableName: 'date_format_type'
    }

    static APP_MANAGEMENT_FORMULARY = new DateFormatTypeAppManagementFormularyManager()
}

class Formulary extends models.Model {
    attributes = {
        createdAt: new models.fields.DatetimeField({autoNowAdd: true }),
        updatedAt: new models.fields.DatetimeField({autoNow: true }),
        uuid: new models.fields.UUIDField({ autoGenerate: true }),
        name: new models.fields.CharField({ dbIndex: true }),
        labelName: new models.fields.CharField({ dbIndex: true }),
        app: new models.fields.ForeignKeyField({
            relatedTo: 'App',
            onDelete: models.fields.ON_DELETE.CASCADE
        })
    }

    options = {
        tableName: 'formulary'
    }
}

class Section extends models.Model {
    attributes = {
        createdAt: new models.fields.DatetimeField({autoNowAdd: true }),
        updatedAt: new models.fields.DatetimeField({autoNow: true }),
        uuid: new models.fields.UUIDField({ autoGenerate: true }),
        name: new models.fields.CharField(),
        labelName: new models.fields.CharField(),
        order: new models.fields.IntegerField({ defaultValue: 1 }),
        formulary: new models.fields.ForeignKeyField({
            relatedTo: 'Formulary',
            onDelete: models.fields.ON_DELETE.CASCADE
        }),
        sectionType: new models.fields.ForeignKeyField({
            relatedTo: 'SectionType',
            onDelete: models.fields.ON_DELETE.CASCADE
        })
    }

    options = {
        tableName: 'section',
        ordering: ['order']
    }
}

class Field extends models.Model {
    attributes = {
        createdAt: new models.fields.DatetimeField({autoNowAdd: true }),
        updatedAt: new models.fields.DatetimeField({autoNow: true }),
        uuid: new models.fields.UUIDField({ autoGenerate: true }),
        name: new models.fields.CharField(),
        labelName: new models.fields.CharField(),
        placeholder: new models.fields.CharField({ allowBlank: true, allowNull: true }),
        required: new models.fields.BooleanField({ defaultValue: true }),
        order: new models.fields.IntegerField({ defaultValue: 1 }),
        isUnique: new models.fields.BooleanField({ defaultValue: false }),
        fieldIsHidden: new models.fields.BooleanField({ defaultValue: false }),
        labelIsHidden: new models.fields.BooleanField({ defaultValue: false }),
        section: new models.fields.ForeignKeyField({
            relatedTo: 'Section',
            onDelete: models.fields.ON_DELETE.CASCADE
        }),
        fieldType: new models.fields.ForeignKeyField({
            relatedTo: 'FieldType',
            onDelete: models.fields.ON_DELETE.CASCADE
        })
    }

    options = {
        tableName: 'field',
        ordering: ['order']
    }
}

class FieldConnection extends models.Model {
    attributes = {
        uuid: new models.fields.UUIDField({ autoGenerate: true }),
        field: new models.fields.OneToOneField({
            relatedTo: 'Field',
            onDelete: models.fields.ON_DELETE.CASCADE
        }),
        formulary: new models.fields.ForeignKeyField({
            relatedTo: 'Formulary',
            onDelete: models.fields.ON_DELETE.CASCADE
        }),
        fieldAsOption: new models.fields.ForeignKeyField({
            relatedTo: 'Field',
            onDelete: models.fields.ON_DELETE.CASCADE
        })
    }

    options = {
        tableName: 'field_connection'
    }
}

class FieldDate extends models.Model {
    attributes = {
        uuid: new models.fields.UUIDField({ autoGenerate: true }),
        field: new models.fields.OneToOneField({
            relatedTo: 'Field',
            onDelete: models.fields.ON_DELETE.CASCADE
        }),
        autoCreate: new models.fields.BooleanField({ defaultValue: false }),
        autoUpdate: new models.fields.BooleanField({ defaultValue: false }),
        dateFormatType: new models.fields.ForeignKeyField({
            relatedTo: 'DateFormatType',
            onDelete: models.fields.ON_DELETE.CASCADE
        }),
        timeFormatType: new models.fields.ForeignKeyField({
            relatedTo: 'TimeFormatType',
            onDelete: models.fields.ON_DELETE.CASCADE
        })
    }   

    options = {
        tableName: 'field_date',
    }
}

class FieldNumber extends models.Model {
    attributes = {
        uuid: new models.fields.UUIDField({ autoGenerate: true }),
        field: new models.fields.OneToOneField({
            relatedTo: 'Field',
            onDelete: models.fields.ON_DELETE.CASCADE
        }),
        prefix: new models.fields.CharField({ allowBlank: true, allowNull: true, defaultValue: null }),
        allowNegative: new models.fields.BooleanField({ defaultValue: false }),
        allowZero: new models.fields.BooleanField({ defaultValue: false }),
        numberFormatType: new models.fields.ForeignKeyField({
            relatedTo: 'NumberFormatType',
            onDelete: models.fields.ON_DELETE.CASCADE
        }),
        decimalCharacter: new models.fields.CharField({ defaultValue: '.' }),
        thousandSeparatorCharacter: new models.fields.CharField({ defaultValue: ',' })
    }

    options = {
        tableName: 'field_number',
    }
}

class FieldUser extends models.Model {
    attributes = {
        uuid: new models.fields.UUIDField({ autoGenerate: true }),
        field: new models.fields.OneToOneField({
            relatedTo: 'Field',
            onDelete: models.fields.ON_DELETE.CASCADE
        }),
        autoCreate: new models.fields.BooleanField({ defaultValue: false }),
        autoUpdate: new models.fields.BooleanField({ defaultValue: false }),
    }

    options = {
        tableName: 'field_user'
    }
}

class FieldFormula extends models.Model {
    attributes = {
        uuid: new models.fields.UUIDField({ autoGenerate: true }),
        field: new models.fields.OneToOneField({
            relatedTo: 'Field',
            onDelete: models.fields.ON_DELETE.CASCADE
        }),
        formula: new models.fields.TextField(),
    }

    options = {
        tableName: 'field_formula'
    }
}

class Option extends models.Model {
    attributes = {
        createdAt: new models.fields.DatetimeField({autoNowAdd: true }),
        updatedAt: new models.fields.DatetimeField({autoNow: true }),
        uuid: new models.fields.UUIDField({ autoGenerate: true }),
        field: new models.fields.ForeignKeyField({
            relatedTo: 'Field',
            onDelete: models.fields.ON_DELETE.CASCADE
        }),
        order: new models.fields.IntegerField({ defaultValue: 1 }),
        value: new models.fields.CharField(),
    }

    options = {
        tableName: 'option',
        ordering: ['order']
    }
}

module.exports = {
    SectionType,
    FieldType,
    NumberFormatType,
    DateFormatType,
    TimeFormatType,
    Formulary,
    Section,
    Field,
    FieldConnection,
    FieldDate,
    FieldNumber,
    Option,
    FieldUser,
    FieldFormula
}