/** @module src/authentication/middlewares */

const status = require('../../../palmares/status')
const websocket = require('../../../palmares/websockets')

const { JWT } = require('./utils')
const { User, Workspace } = require('./models')
const { Encrypt } = require('../core/utils')
const { reflowJSONError } = require('../core/services')
const { validatePermissionsFromRequest, PermissionsError } = require('../core/permissions')

/**
 * Middleware responsible for validating the user authentication. This is really similar to 
 * `jwtRequiredMiddleware` middleware function except this is for websockets.
 * 
 * We have created the websockets inside of the framework, for the user to be able to authenticate
 * he needs to send the token as a query string parameter.
 * 
 * @param {object} scope - Object with .params, .query and .websocket properties used for interacting
 * with the websocket and what is recieved from the client.
 * @param {function} next - A function similar to express next function. This calls the next consumer to validate the connection.
 * 
 * @throws {DenyConnection} - If the user is not authenticated or the token query param does not exist we deny the connection.
 */
async function websocketJwtRequiredMiddleware(scope, __, next) {
    const jwt = new JWT(scope.query.token)
    if (jwt.isValid() && jwt.data.type === 'access') {
        scope.user = await User.AUTHENTICATION.userById(jwt.data.id)
        next()
    } else if (['jwt_not_defined', 'unknown_error'].includes(jwt.error)) {
        const error = JSON.stringify(
            reflowJSONError({reason: 'login_required', detail: 'JWT token was not provided in the request'})
        )
        throw new websocket.DenyConnection(error)
    } else {
        const error = JSON.stringify(
            reflowJSONError({reason: jwt.error, detail: 'JWT token it not valid anymore'})
        )
        throw new websocket.DenyConnection(error)
    }
}

/**
 * Middleware responsible for authenticating the user with the JWT token generated for him in the login process.
 * 
 * After 24 hours this token will be invalid 
 * @param {Express.Request} req - The request object from express
 * @param {Express.Response} res - The response object recieved from express
 * @param {Function} next - Callback function to be called after the middleware and call next middlware or controller.
 */
async function jwtRequiredMiddleware(req, res, next) {
    const jwt = new JWT()
    jwt.extractJWTFromRequest(req)
    if (jwt.isValid() && jwt.data.type === 'access') {
        req.user = await User.AUTHENTICATION.userById(jwt.data.id)
        next()
    } else if (['jwt_not_defined', 'unknown_error'].includes(jwt.error)) {
        res.status(status.HTTP_403_FORBIDDEN).send({
            status: 'error',
            error: reflowJSONError({reason: 'login_required', detail: 'JWT token was not provided in the request'})
        })
    } else {
        res.status(status.HTTP_403_FORBIDDEN).send({
            status: 'error',
            error: reflowJSONError({reason: jwt.error, detail: 'JWT token it not valid anymore'})
        })
    }
}


/**
 * This middleware automatically decrypts the workspaceId for you, so you don't have to care about it in you controllers.
 * We will override the 'req.params.companyId' with the decrypted companyId.
 * 
 * @param {Express.Request} req - The request object from express
 * @param {Express.Response} res - The response object recieved from express
 * @param {Function} next - Callback function to be called after the middleware and call next middlware or controller.
 */
async function workspaceRequiredMiddleware(req, res, next) {
    if (req.params.workspaceUUID !== undefined) {
        req.workspace = await Workspace.AUTHENTICATION.workspaceByUUID(req.params.workspaceUUID)
    }
    next()
}

/**
 * This is used to validating all of the permissions of the user. Does the user have access to it, or not. 
 * By default the users have permission FOR EVERYTHING so you need to block what he can and what he can't acess
 * creating custom permission classes inside of the apps.
 * 
 * Permissions are not default to either express or the framework, we've created it and defined in `src/core/permissions.js`.
 * This will add the `permissions.js` files to your apps. To understand how permissions work read 
 * `src/core/permissions/validatePermissionsFromRequest` to understand how to create permissions and to validate if the users have an access or not.
 * 
 * @param {Express.Request} req - The request object from express
 * @param {Express.Response} res - The response object recieved from express
 * @param {Function} next - Callback function to be called after the middleware and call next middlware or controller.
 */
async function loggedUserPermissionsMiddleware(req, res, next) {
    try {
        await validatePermissionsFromRequest(req, 'DEFAULT')
        next()
    } catch (e) {
        if (e instanceof PermissionsError) {
            const error =  JSON.parse(e.message)
            res.status(error.status).json({
                status: 'error',
                error: reflowJSONError({reason: error.reason, detail: error.detail})
            })
        } else {
            throw new Error(e.toString())
        }
    }
}

/** a recipe is something that will append a number of middleware/options so you can setup it easily in your paths. */
const loggedUserRecipe = [jwtRequiredMiddleware, loggedUserPermissionsMiddleware]

/** 
 * a recipe is something that will append a number of middleware/options so you can setup it easily in your paths.
 * This is for admin only paths, only available for admins.
 */
const adminOnlyUserRecipe = [{ adminOnly: true}, ...loggedUserRecipe]

/**
 * This recipe is used to validate the workspace of the user, we will retrieve the workspace data from the request.
 */
const workspaceRequiredRecipe = [...loggedUserRecipe, workspaceRequiredMiddleware]

/**
 * Same as above but for admin only paths.
 */
const adminOnlyWorkspaceRecipe = [...adminOnlyUserRecipe, workspaceRequiredMiddleware]

module.exports = {
    websocketJwtRequiredMiddleware,
    jwtRequiredMiddleware,
    loggedUserPermissionsMiddleware,
    loggedUserRecipe,
    adminOnlyUserRecipe,
    workspaceRequiredRecipe,
    adminOnlyWorkspaceRecipe,
}