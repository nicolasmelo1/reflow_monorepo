/**
* Automatically Generated by Reflow at 2022-01-07T20:02:18.192Z
* */

'use strict'

module.exports = {
    engine: "SequelizeEngine",
    dependency: "9_auto_migration_1641489459563",
    operations: (models, actions) => {
        return [
			new actions.CreateColumn(
        		"AvailableApp",
        		"labelName",
        		new models.fields.TextField({"underscored":true,"primaryKey":false,"allowBlank":true,"allowNull":true,"unique":false,"dbIndex":false,"databaseName":"label_name","customAttributes":{},"attributeName":"labelName"})
    		),
			new actions.RenameModel(
        		"RequiredMetadataForApp",
        		"MetadataForApp"
    		),
			new actions.ChangeModel(
        		"MetadataForApp",
        		{
					autoId: true,
					primaryKeyField: new models.fields.BigAutoField({"underscored":true,"primaryKey":true,"allowBlank":true,"allowNull":false,"unique":false,"dbIndex":false,"databaseName":"id","customAttributes":{},"attributeName":"id"}),
					abstract: false,
					underscored: true,
					tableName: "required_metadata_for_app",
					managed: true,
					ordering: [],
					indexes: [],
					customOptions: {},
				},
        		{
					autoId: true,
					primaryKeyField: new models.fields.BigAutoField({"underscored":true,"primaryKey":true,"allowBlank":true,"allowNull":false,"unique":false,"dbIndex":false,"databaseName":"id","customAttributes":{},"attributeName":"id"}),
					abstract: false,
					underscored: true,
					tableName: "metadata_for_app",
					managed: true,
					ordering: [],
					indexes: [],
					customOptions: {},
				}
    		),
			new actions.CreateColumn(
        		"MetadataForApp",
        		"availableApp",
        		new models.fields.ForeignKeyField({"underscored":true,"primaryKey":false,"allowBlank":true,"allowNull":true,"unique":false,"dbIndex":false,"databaseName":"available_app_id","customAttributes":{},"attributeName":"availableApp","relatedTo":"AvailableApp","fieldName":"availableAppId","onDelete":"cascade","relatedName":null,"toField":null})
    		),
        ]
    }
}