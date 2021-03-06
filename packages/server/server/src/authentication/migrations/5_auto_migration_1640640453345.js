/**
* Automatically Generated by Reflow at 2021-12-27T21:27:33.342Z
* */

'use strict'

module.exports = {
    engine: "SequelizeEngine",
    dependency: "4_auto_migration_1640383653369",
    operations: (models, actions) => {
        return [
			new actions.ChangeColumn(
        		"User",
        		"email",
        		new models.fields.TextField({"underscored":true,"primaryKey":false,"allowBlank":true,"allowNull":false,"unique":false,"dbIndex":false,"databaseName":"email","customAttributes":{},"attributeName":"email"}),
        		new models.fields.TextField({"underscored":true,"primaryKey":false,"allowBlank":true,"allowNull":false,"unique":true,"dbIndex":false,"databaseName":"email","customAttributes":{},"attributeName":"email"})
    		),
			new actions.CreateColumn(
        		"Workspace",
        		"uuid",
        		new models.fields.UUIDField({"underscored":true,"primaryKey":false,"allowBlank":false,"allowNull":true,"unique":false,"dbIndex":true,"databaseName":"uuid","customAttributes":{},"attributeName":"uuid","maxLength":32,"autoGenerate":false})
    		),
        ]
    }
}