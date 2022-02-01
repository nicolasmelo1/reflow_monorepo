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
    TypeController,
} = require('./controllers')


const loginRequiredRoutes = [
    path('/types', ...loggedUserRecipe, TypeController.asController()),
    path('/me', ...loggedUserRecipe, MeController.asController()),
    path('/test_token', jwtRequiredMiddleware, TestTokenController.asController()),
]

const routes = [
    path('/login', LoginController.asController()),
    path('/refresh_token', RefreshTokenController.asController()),
    ...loginRequiredRoutes
]

module.exports = routes