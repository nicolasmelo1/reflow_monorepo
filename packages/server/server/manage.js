const path = require('path')
const { spawn } = require('child_process')
const commands = require('../palmares/commands')
const conf = require('../palmares/conf')

process.on('SIGINT', () => {
    spawn('npm', ['run', 'stop'], { 
        stdio: 'inherit',
        cwd: path.join(__dirname),
        env : process.env
    })
})

conf.defineDefaultPathToSettings(path.join(__dirname, 'src', 'settings.js'))
commands()