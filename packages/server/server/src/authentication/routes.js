/** @module src/authentication/routes */

const { path } = require('../../../palmares/routers')

const {
    jwtRequiredMiddleware,
    loggedUserRecipe
} = require('./middlewares')

const { 
    LoginController, 
    RefreshTokenController,
    TestTokenController,
    MeController,
} = require('./controllers')


const loginRequiredRoutes = [
    path('/me', ...loggedUserRecipe, MeController.asController()),
    path('/test_token', jwtRequiredMiddleware, TestTokenController.asController()),
]

const routes = [
    path('/login', LoginController.asController()),
    path('/refresh_token', RefreshTokenController.asController()),
    ...loginRequiredRoutes
]

module.exports = routes