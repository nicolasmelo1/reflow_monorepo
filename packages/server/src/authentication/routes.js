/** @module src/authentication/routes */

const { path } = require('../../config/routers')

const {
    jwtRequiredMiddleware,
    loggedUserRecipe,
    adminOnlyUserRecipe
} = require('./middlewares')

const { 
    LoginController, 
    RefreshTokenController,
    TestTokenController,
} = require('./controllers')


const loginRequiredRoutes = [
    path('/test_token', jwtRequiredMiddleware, TestTokenController.asController()),
]

const routes = [
    path('/login', LoginController.asController()),
    path('/refresh_token', RefreshTokenController.asController()),
    ...loginRequiredRoutes
]

module.exports = routes