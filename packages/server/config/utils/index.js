const path = require('path')

/**
 * The path to the settings can be either set in the path `REFLOW_SETTINGS_MODULE` or
 * it defaults to `src/settings.js`.
 */
const getProjectSettings = () => {
    const defaultProjectSettings = path.dirname(path.dirname(path.resolve(__dirname)))
    if (process.env.REFLOW_SETTINGS_MODULE !== undefined) {
        return require(process.env.REFLOW_SETTINGS_MODULE)
    } else {
        return require(path.join(defaultProjectSettings, 'src', 'settings.js'))
    }
}

module.exports = { 
    getProjectSettings
}