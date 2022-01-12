const { models } = require('../../../config/database')

const { 
    FieldTypeAppManagementFormularyManager, 
    TimeFormatTypeAppManagementFormularyManager, 
    DateFormatTypeAppManagementFormularyManager, 
    NumberFormatTypeAppManagementFormularyManager,
    SectionTypeAppManagementFormularyManager,
    FieldConnectionAppManagementFormularyManager,
    FieldDateAppManagementFormularyManager,
    FieldNumberAppManagementFormularyManager,
    FieldFormulaAppManagementFormularyManager,
    FieldUserAppManagementFormularyManager,
    OptionAppManagementFormularyManager,
    FieldAppManagementFormularyManager,
    SectionAppManagementFormularyManager,
    FormularyAppManagementFormularyManager
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

/**
 * This is the formulary model. The formulary will hold everything needed to render the formulary. A formulary
 * is composed by sections and field. A formulary can have one or more sections, and each section can have one 
 * or more fields.
 * 
 * Each formulary is associated to an APP by default, so if the user wants to create another formulary for the same 
 * app it WILL NOT BE POSSIBLE. An app is tied to one and JUST ONE formulary.
 * 
 * Since we tie the formulary to an app, it will be tied to the workspace. There is no link of the formulary
 * to the user that is using the formulary.
 */
class Formulary extends models.Model {
    attributes = {
        createdAt: new models.fields.DatetimeField({autoNowAdd: true }),
        updatedAt: new models.fields.DatetimeField({autoNow: true }),
        uuid: new models.fields.UUIDField({ autoGenerate: true }),
        name: new models.fields.CharField({ dbIndex: true }),
        labelName: new models.fields.CharField({ dbIndex: true }),
        app: new models.fields.OneToOneField({
            relatedTo: 'App',
            onDelete: models.fields.ON_DELETE.CASCADE
        })
    }

    options = {
        tableName: 'formulary'
    }

    static APP_MANAGEMENT_FORMULARY = new FormularyAppManagementFormularyManager()
}

/**
 * All of the formularies are tied to a section. A section is like a group of fields. Most softwares don't have this 
 * concept of sections, but we use it. You can find a reference on another softwares on how this is made
 * taking a look at `google forms`. I think that JotForm also might have this concept but i'm not sure.
 * 
 * The idea is that, every formulary will have one or more sections, so this way you can organize really long formularies
 * with parts.
 * 
 * This is also nice because we can add conditional sections, so we can hide or show the section depending on the values
 * of the fields. It is way easier to setting the same conditional on a bunch of fields.
 * 
 * Last but not least, a section can be `multiple` or `unique`. This part is better explained in `SectionType` model above.
 * But in short, `multiple` means you can repeat the fields over and over again. This is particularly useful for `Historico`
 * in sales pipelines for the sale history.
 */
class Section extends models.Model {
    attributes = {
        createdAt: new models.fields.DatetimeField({autoNowAdd: true }),
        updatedAt: new models.fields.DatetimeField({autoNow: true }),
        uuid: new models.fields.UUIDField({ autoGenerate: true, allowNull: true }),
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

    static APP_MANAGEMENT_FORMULARY = new SectionAppManagementFormularyManager()
}

/**
 * This model will hold the fields of the formulary. Every field are bound to a section AND NOT to a formulary directly.
 * As said in the Formulary model, the section will always hold a bunch of fields. And the formulary will hold a bunch
 * of sections.
 * 
 * Okay so the field can be of many types, a field can access just numbers, others can accept only dates, others only 
 * attachments and so on. You can read more about the options the field types can have in the `FieldType` model.
 * 
 * This will only hold the data/options that apply for all of the field types. For example: adding a custom placeholder.
 * Making it required or not. Making it unique and other configuration options.
 * 
 * You will se models lile FieldConnection, FieldUser, FieldNumber and so on. Those are custom options bound to the field
 * type. Those options are not bounded to the field directly because this will make extremely easy for us to add new 
 * field types and not creating a dependency in the field model. This means that we just add or remove a model if we need
 * some option to a new field type. This model will almost never change, unless we want to add a functionality that applies
 * to all of the fields.
 */
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

    static APP_MANAGEMENT_FORMULARY = new FieldAppManagementFormularyManager()
}

/**
 * Model for holding the configuration for `connection` field types. Those field types are used to connect to connect
 * one formulary to another. This way you can relate data with each other. For example, the `Sales Pipeline` formulary
 * will be connected to `Clients` formulary.
 * 
 * For that to work we need to define a field of the formulary we want to connect as option. What???? For example,
 * suppose the above example. The connection field in `Sales Pipeline` formulary will have multiple options, those options
 * are data from a particular field from `Clients` formulary. 
 */
class FieldConnection extends models.Model {
    attributes = {
        uuid: new models.fields.UUIDField({ autoGenerate: true, allowNull: true }),
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

    static APP_MANAGEMENT_FORMULARY = new FieldConnectionAppManagementFormularyManager()
}

/**
 * This will hold the configuration for the `date` field type. This field type will only accept dates. It can be 
 * automatically defined when we create a new record, or they can update automatically on each save. Besides that
 * we also can define the format of the date, this is how the user will see this date on the front-end, at the same
 * time, we can also define the format of the time. Is it 24h or 12h? The timeformat is completely optional and is
 * not enforced by the system in any way.
 */
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
            onDelete: models.fields.ON_DELETE.CASCADE,
            allowNull: true
        })
    }   

    options = {
        tableName: 'field_date',
    }

    static APP_MANAGEMENT_FORMULARY = new FieldDateAppManagementFormularyManager()
}

/**
 * This will hold the field configuration of the `number` field type. What this holds is a prefix for the field, for example
 * if the user wants to add `R$` in front of the number generated. This will also hold the configuration for example if the
 * number field type should allow negative numbers or not. Also we check if the number can be 0 or not.
 * 
 * The decimal character `.` or `,` in Brazil can be configured as well with the user needs. Also the user can define if he
 * wants to use `,` or `.` as the thousand separator character. Obviously both of them cannot be equal. I mean, if the decimal
 * character is ',' then the thousand separator CANNOT be ',' and needs to be something else.
 * 
 * Last but not least, this will also hold the format of the number, how to format the number. You should check `NumberFormatType`
 * for that.
 */
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

    static APP_MANAGEMENT_FORMULARY = new FieldNumberAppManagementFormularyManager()
}

/**
 * For the `user` field type, there is no much configuration to do. The only possible configurations are 
 * similar to the FieldDate model. We can assign the user automatically when a record is created, but not 
 * reassigned when updated, or we can assign the user anytime he saves the record.
 */
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

    static APP_MANAGEMENT_FORMULARY = new FieldUserAppManagementFormularyManager()
}

/**
 * This will hold the formula to run. Don't know what are formulas? Reach to Flow on the `shared` folder.
 * This is exactly the formulas that we run, it's a programming language we built from scratch to run not just
 * simple stuff but complex stuff like automations and other more complicated stuff. The idea is that is 100%
 * translatable and easy to understand by someone with no programming experience.
 * 
 * You can read more from it reading carefully trough the source code of `flow`, everything is explained there.
 */
class FieldFormula extends models.Model {
    attributes = {
        uuid: new models.fields.UUIDField({ autoGenerate: true }),
        field: new models.fields.OneToOneField({
            relatedTo: 'Field',
            onDelete: models.fields.ON_DELETE.CASCADE
        }),
        formula: new models.fields.TextField({ allowBlank: true }),
    }

    options = {
        tableName: 'field_formula'
    }

    static APP_MANAGEMENT_FORMULARY = new FieldFormulaAppManagementFormularyManager()
}

/**
 * This are the options for some fieldTypes that display options. Right now the fields that will have options are
 * both the `tags` and `option` field types. That's all this does. This is also used to display the columns of the
 * kanban visualization board.
 * 
 * This way each column on the kanban will be a `option`. So when we add a new column in the kanban we will also add
 * a new option here. When we reorder the columns of the kanban we will also reorder the options here.
 * One thing is tied to the other tightly.
 */
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

    static APP_MANAGEMENT_FORMULARY = new OptionAppManagementFormularyManager()
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