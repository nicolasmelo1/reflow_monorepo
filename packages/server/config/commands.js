const path = require('path')
const logger = require('./logging')

/**
 * Responsible for handling all of the cli commands, instead of making a lot of files we can just run manage.js
 * and run the commands that we need like migrate, makemigrations and runserver, right now it doesn't support at any arguments
 * but we can support that in the near future using a proper cli library.
 */
const handleCommands = () => {
    const cliArguments = process.argv.slice(2)

    const defaultProjectSettings = path.dirname(path.resolve(__dirname))
    logger.INFO.USING_SETTINGS(defaultProjectSettings)

    const settings = require(path.join(defaultProjectSettings, 'src', 'settings.js'))

    switch (cliArguments[0]) {
        case 'migrate':
            const migrate = require('./database/migrations/migrate')
            Promise.resolve(migrate(settings))
            break
        case 'makemigrations':
            const makemigrations = require('./database/migrations/makemigrations')
            makemigrations(settings)
            break
        case 'runserver':
            const initializeApp = require('./')
            initializeApp(settings)
            break
        case 'teste':
            for (let i=0; i< settings.INSTALLED_APPS.length; i++) {
                const appName = settings.INSTALLED_APPS[i]

                const fullPath = path.join(settings.BASE_PATH, appName)
                const app = require(fullPath)
                const initializedApp = new app()
                initializedApp.getModels()
            }
            break
        default:
            console.log('Invalid command')
    }
}

module.exports = handleCommands