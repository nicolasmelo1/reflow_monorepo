const bodyParser = require('body-parser')

const { path } = require('../../../palmares/routers')

const {
    DraftSaveFileController
} = require('./controllers')
const { fileUpload } = require('../core/utils')
const { workspaceRequiredRecipe } = require('../authentication/middlewares')

const routes = [
    path('/:workspaceUUID', [
        path('/file', ...workspaceRequiredRecipe, bodyParser.raw({type:'application/octet-stream'}) /*fileUpload.any()*/, DraftSaveFileController.asController())
    ])
]

module.exports = routes