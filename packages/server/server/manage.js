const path = require('path')

const commands = require('../palmares/commands')
const conf = require('../palmares/conf')

conf.defineDefaultPathToSettings(path.join(__dirname, 'src', 'settings.js'))
commands()