const { path } = require('../config/routers')

const routes = [
    path('/core', require('./core/routes')),
    path('/authentication', require('./authentication/routes'))
]

module.exports = routes