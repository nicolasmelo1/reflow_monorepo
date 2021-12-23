const { path } = require('../../config/routers')

const { 
    HealthCheckController,
    TestPermissionsController
} = require('./controllers')

const routes = [
    path('/healthcheck', HealthCheckController.asController()),
    path('/test_permissions', TestPermissionsController.asController())
]

module.exports = routes