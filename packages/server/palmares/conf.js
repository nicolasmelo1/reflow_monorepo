const path = require('path')

let DEFAULT_PROJECT_SETTINGS_PATH = process.env.PALMARES_SETTINGS_MODULE !== undefined ? 
    process.env.PALMARES_SETTINGS_MODULE :
    path.join(path.dirname(__dirname), 'src', 'settings.js')

let settings = {}
try {
    settings = require(DEFAULT_PROJECT_SETTINGS_PATH)
} catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') {
        throw e
    }
}

/**
 * This is used to change the default settings path. It should be used before the app is initialized. 
 * To prevend any issues, it's better if you add this to `manage.js` where you will run all of the framework commands.
 * 
 * @param {string} defaultPathToSettings - The FULL path to the settings.js file.
 */
function defineDefaultPathToSettings(defaultPathToSettings) {
    process.env.PALMARES_SETTINGS_MODULE = defaultPathToSettings
    DEFAULT_PROJECT_SETTINGS_PATH = defaultPathToSettings
    settings = require(defaultPathToSettings)
}

/**
 * The path to the settings can be either set in the path `PALMARES_SETTINGS_MODULE` or
 * it defaults to `src/settings.js`.
 * 
 * @return {object} - Returns the settings object with all of the settings, if you want to define some default values to
 * the setting before retrieving it this is where you will do it.
 */
function getProjectSettings() {
    return settings
}

module.exports = {
    DEFAULT_PROJECT_SETTINGS_PATH,
    settings: getProjectSettings(),
    defineDefaultPathToSettings
}