const bodyParser = require('body-parser')

const { path } = require('../../../palmares/routers')

const {
    DraftSaveFileController,
    DraftFileUrlController,
    DraftRemoveController
} = require('./controllers')
const { workspaceRequiredRecipe } = require('../authentication/middlewares')

const routes = [
    path('/file', ...workspaceRequiredRecipe, [
        path('', bodyParser.raw({type:'application/octet-stream'}), DraftSaveFileController.asController()),
        path('/url/:draftStringId', DraftFileUrlController.asController()),
    ]),
    path('/:draftStringId', ...workspaceRequiredRecipe, DraftRemoveController.asController())
]

module.exports = routes