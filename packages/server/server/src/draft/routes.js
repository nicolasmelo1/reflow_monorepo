const { path } = require('../../../palmares/routers')

const {
    DraftSaveFileController
} = require('./controllers')
const { fileUpload } = require('../core/utils')
const { workspaceRequiredRecipe } = require('../authentication/middlewares')

const routes = [
    path('/:workspaceUUID', [
        path('/file', ...workspaceRequiredRecipe, fileUpload.any(), DraftSaveFileController.asController())
    ])
]

module.exports = routes