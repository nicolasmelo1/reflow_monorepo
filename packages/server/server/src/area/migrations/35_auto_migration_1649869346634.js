/**
* Automatically Generated by Palmares at 2022-04-13T17:02:26.633Z
* */

'use strict'

module.exports = {
    engine: "SequelizeEngine",
    dependency: "34_auto_migration_1649713597128",
    operations: (models, actions) => {
        return [
			new actions.RemoveColumn(
        		"App",
        		"appType"
    		),
			new actions.DeleteModel(
        		"AppType"
    		),
        ]
    }
}