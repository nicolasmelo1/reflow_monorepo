const { models } = require('../../../palmares/database')


class Kanban extends models.Model {
    attributes = {
        app: models.fields.ForeignKeyField({
            relatedTo: 'App',
            onDelete: models.fields.ON_DELETE.CASCADE,
        })
    }

    options = {
        tableName: 'kanban',
    }
}


class KanbanPhases extends models.Model {
    attributes = {
        name: models.fields.CharField(),
        kanban: models.fields.ForeignKeyField({
            relatedTo: 'kanban',
            onDelete: models.fields.ON_DELETE.CASCADE,
        }),
        order: models.fields.BigIntegerField({ defaultValue: 0 })
    }

    options = {
        tableName: 'kanban_phases',
    }
}


class KanbanPhaseFields extends models.Model {
    attributes = {
        name: models.fields.CharField(),
        field: models.fields.ForeignKeyField({
            relatedTo: 'Field',
            onDelete: models.fields.ON_DELETE.CASCADE,
        })     
    }

    options = {
        tableName: 'kanban_phase_fields',
    }
}

module.exports = {
    KanbanPhases,
    Kanban,
}