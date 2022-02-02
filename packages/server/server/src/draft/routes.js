const bodyParser = require('body-parser')

const { path } = require('../../../palmares/routers')

const {
    DraftSaveFileController,
    DraftFileUrlController
} = require('./controllers')
const { workspaceRequiredRecipe } = require('../authentication/middlewares')

const routes = [
    path('/:workspaceUUID', [
        path('/file', ...workspaceRequiredRecipe, [
            path('', bodyParser.raw({type:'application/octet-stream'}), DraftSaveFileController.asController()),
            path('/url/:draftStringId', DraftFileUrlController.asController())
        ])
    ])
]

module.exports = routes