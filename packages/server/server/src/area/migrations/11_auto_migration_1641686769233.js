/**
* Automatically Generated by Reflow at 2022-01-09T00:06:09.233Z
* */

'use strict'

module.exports = {
    engine: "SequelizeEngine",
    dependency: "10_auto_migration_1641585738192",
    operations: (models, actions) => {
        return [
			new actions.ChangeColumn(
        		"AppConfiguration",
        		"metadata",
        		new models.fields.ForeignKeyField({"underscored":true,"primaryKey":false,"allowBlank":true,"allowNull":false,"unique":false,"dbIndex":false,"databaseName":"metadata_id","customAttributes":{},"attributeName":"metadata","relatedTo":"RequiredMetadataForApp","fieldName":"metadataId","onDelete":"cascade","relatedName":null,"toField":null}),
        		new models.fields.ForeignKeyField({"underscored":true,"primaryKey":false,"allowBlank":true,"allowNull":false,"unique":false,"dbIndex":false,"databaseName":"metadata_id","customAttributes":{},"attributeName":"metadata","relatedTo":"MetadataForApp","fieldName":"metadataId","onDelete":"cascade","relatedName":null,"toField":null})
    		),
        ]
    }
}