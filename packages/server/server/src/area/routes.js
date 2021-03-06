const { path } = require('../../../palmares/routers')

const { workspaceRequiredRecipe, loggedUserRecipe } = require('../authentication/middlewares')
const { AreaController, AreaEditController, TypeController } = require('./controllers')

const routes = [
    path('/types', ...loggedUserRecipe, TypeController.asController()),
    path('/:workspaceUUID', ...workspaceRequiredRecipe, [
        path('/areas', AreaController.asController()),
        path('/areas/:areaUUID', [
            path('', AreaEditController.asController()),
        ])
    ])
]

module.exports = routes