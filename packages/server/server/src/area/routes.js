const { path } = require('../../../palmares/routers')

const { workspaceRequiredRecipe } = require('../authentication/middlewares')
const { AreaController, AreaEditController, AppController } = require('./controllers')

const routes = [
    path('/:workspaceUUID', ...workspaceRequiredRecipe, [
        path('/areas', AreaController.asController()),
        path('/areas/:areaUUID', [
            path('', AreaEditController.asController()),
            path('/apps/:appUUID', AppController.asController()),
        ])
    ])
]

module.exports = routes