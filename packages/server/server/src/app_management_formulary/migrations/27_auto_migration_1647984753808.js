/**
* Automatically Generated by Reflow at 2022-03-22T21:32:33.808Z
* */

'use strict'

module.exports = {
    engine: "SequelizeEngine",
    dependency: "26_auto_migration_1647555202664",
    operations: (models, actions) => {
        return [
			new actions.DeleteModel(
        		"SectionFields"
    		),
			new actions.DeleteModel(
        		"Section"
    		),
			new actions.DeleteModel(
        		"SectionType"
    		)
        ]
    }
}