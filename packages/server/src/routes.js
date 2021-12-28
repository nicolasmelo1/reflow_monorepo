const { path } = require('../config/routers')

const routes = [
    path('/core', require('./core/routes')),
    path('/area', require('./area/routes')),
    path('/authentication', require('./authentication/routes')),
]

module.exports = routes