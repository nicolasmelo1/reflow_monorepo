/**
* Automatically Generated by Reflow at 2022-01-06T17:17:39.562Z
* */

'use strict'

module.exports = {
    engine: "SequelizeEngine",
    dependency: "8_auto_migration_1641487761298",
    operations: (models, actions) => {
        return [
			new actions.ChangeColumn(
        		"Area",
        		"subAreaOf",
        		new models.fields.ForeignKeyField({"underscored":true,"primaryKey":false,"allowBlank":true,"allowNull":true,"unique":false,"dbIndex":false,"databaseName":"sub_area_of_id","customAttributes":{},"attributeName":"subAreaOf","relatedTo":"Area","fieldName":"subAreaOfId","onDelete":"set_null","relatedName":"subAreas","toField":null}),
        		new models.fields.ForeignKeyField({"underscored":true,"primaryKey":false,"allowBlank":true,"allowNull":true,"unique":false,"dbIndex":false,"databaseName":"sub_area_of_id","customAttributes":{},"attributeName":"subAreaOf","relatedTo":"Area","fieldName":"subAreaOfId","onDelete":"cascade","relatedName":"subAreas","toField":null})
    		),
        ]
    }
}