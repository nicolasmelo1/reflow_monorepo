const { path } = require('../config/routers')

const routes = [
    path('/core', require('./core/routes')),
]

module.exports = routes