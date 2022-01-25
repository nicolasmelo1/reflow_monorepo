const path = require('path')
const logger = require('./logging')
const pm2 = require('pm2')

/**
 * Responsible for handling all of the cli commands, instead of making a lot of files we can just run manage.js
 * and run the commands that we need like migrate, makemigrations and runserver, right now it doesn't support at any arguments
 * but we can support that in the near future using a proper cli library.
 */
const handleCommands = () => {
    const cliArguments = process.argv.slice(2)

    const { settings, DEFAULT_PROJECT_SETTINGS_PATH } = require('./conf')
    logger.INFO.USING_SETTINGS(DEFAULT_PROJECT_SETTINGS_PATH)

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
            pm2.connect(true, (err) => {
                if (err) {
                    console.error(err)
                    process.exit(2)
                }
                pm2.start({
                    script: path.join(__dirname, 'index.js'),
                    name: 'reflow',
                    env: {
                        REFLOW_SETTINGS_MODULE: DEFAULT_PROJECT_SETTINGS_PATH
                    }
                }, function(err, apps) {
                    if (err) {
                        console.error(err)
                        return pm2.disconnect()
                    }
                    pm2.list((err, list) => {                  
                        pm2.restart('api', (err, proc) => {
                            // Disconnects from PM2
                            pm2.disconnect()
                        })
                    })
                })
            })
            break
        default:
            console.log('Invalid command')
    }
}

module.exports = handleCommands