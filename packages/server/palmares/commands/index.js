const logger = require('../logging')
const { spawn } = require('child_process')
const pm2 = require('pm2')
const path = require('path')

/**
 * Responsible for handling all of the cli commands, instead of making a lot of files we can just run manage.js
 * and run the commands that we need like migrate, makemigrations and runserver, right now it doesn't support at any arguments
 * but we can support that in the near future using a proper cli library.
 */
const handleCommands = () => {
    const cliArguments = process.argv.slice(2)

    logger.INFO.USING_SETTINGS(process.env.PALMARES_SETTINGS_MODULE)

    switch (cliArguments[0]) {
        case 'migrate':
            const migrate = require('../database/migrations/migrate')
            Promise.resolve(migrate(settings))
            break
        case 'makemigrations':
            const makemigrations = require('../database/migrations/makemigrations')
            makemigrations(settings)
            break
        case 'runserver':
            spawn('npm', ['run', 'startapp'], { 
                stdio: 'inherit',
                cwd: path.join(__dirname, '..'),
                env : process.env
            })
            break
        default:
            console.log('Invalid command')
    }
}

module.exports = handleCommands