const { models } = require('../../../config/database')

/**
 * This model is a type, it contains all of the data needed 
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
}

class FieldType extends models.Model {
    attributes = {
        name: new models.fields.CharField({ dbIndex: true }),
        order: new models.fields.IntegerField({ defaultValue: 1 })
    }

    options = {
        ordering: ['order'],
        tableName: 'field_type'
    }
}

class NumberFormatType extends models.Model {
    attributes = {
        name: new models.fields.CharField({ dbIndex: true }),
        order: new models.fields.IntegerField({ defaultValue: 1 }),
        precision: new models.fields.BigIntegerField({ defaultValue: 1 }),
        prefix: new models.fields.CharField({ defaultValue: null, allowNull: true, maxLength: 250 }),
        suffix: new models.fields.CharField({ defaultValue: null, allowNull: true, maxLength: 250 }),
        thousandsSeparator: new models.fields.CharField({ defaultValue: null, allowNull: true, maxLength: 10 }),
        decimalSeparator: new models.fields.CharField({ defaultValue: null, allowNull: true, maxLength: 10 }),
        base: new models.fields.BigIntegerField({ defaultValue: 1 })
    }

    options = {
        ordering: ['order'],
        tableName: 'number_format_type'
    }
}

class TimeFormatType extends models.Model {
    attributes = {
        name: new models.fields.CharField({ dbIndex: true }),
        order: new models.fields.IntegerField({ defaultValue: 1 })
    }

    options = {
        ordering: ['order'],
        tableName: 'time_format_type'
    }
}

class DateFormatType extends models.Model {
    attributes = {
        name: new models.fields.CharField({ dbIndex: true }),
        order: new models.fields.IntegerField({ defaultValue: 1 })
    }

    options = {
        ordering: ['order'],
        tableName: 'date_format_type'
    }
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

class FieldOption extends models.Model {
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
        tableName: 'field_option',
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
    FieldOption
}