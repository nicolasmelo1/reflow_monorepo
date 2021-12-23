/** @module src/authentication/routes */

const { path } = require('../../config/routers')

const {
    jwtRequiredMiddleware,
    loggedUserRecipe,
    adminOnlyUserRecipe
} = require('./middlewares')

const { 
    LoginController, 
    ForgotPasswordController,
    ChangePasswordController,
    RefreshTokenController,
    TestTokenController,
} = require('./controllers')


const loginRequiredRoutes = [
    path('/test_token', jwtRequiredMiddleware, TestTokenController.asController()),
]

const routes = [
    path('/login', LoginController.asController()),
    path('/forgot', ForgotPasswordController.asController()),
    path('/refresh_token', RefreshTokenController.asController()),
    path('/change_password', ChangePasswordController.asController()),
    ...loginRequiredRoutes
]

module.exports = routes