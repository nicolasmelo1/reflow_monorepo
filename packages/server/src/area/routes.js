const { path } = require("../../config/routers")

const { workspaceRequiredRecipe } = require("../authentication/middlewares")
const { AreaController } = require("./controllers")

const routes = [
    path('/:workspaceUUID', ...workspaceRequiredRecipe, [
        path('/areas', AreaController.asController())
    ])
]

module.exports = routes