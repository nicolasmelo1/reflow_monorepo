const { path } = require('../config/routers')

const { websocketJwtRequiredMiddleware } = require('./authentication/middlewares')
const { UserConsumer } = require('./core/consumers')
//const SurveyConsumer = require('./analytics/consumers')


const routing = [
    path('/websocket', [
        path('/user', websocketJwtRequiredMiddleware, UserConsumer)
    ], {adminOnly: true})
]

module.exports = routing