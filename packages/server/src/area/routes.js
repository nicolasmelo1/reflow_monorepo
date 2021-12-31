const { path } = require("../../config/routers")

const { workspaceRequiredRecipe } = require("../authentication/middlewares")
const { AreaController, AreaEditController } = require("./controllers")

const routes = [
    path('/:workspaceUUID', ...workspaceRequiredRecipe, [
        path('/areas', AreaController.asController()),
        path('/areas/:areaUUID', AreaEditController.asController())
    ])
]

module.exports = routes