const CORS = require('./utils/cors')

/**
 * I could use cors() middleware, but you wouldn't learn something
 * new by doing so.
 * 
 * So instead i'm using a custom middleware that allow us to learn and
 * also have full control over.
 * 
 * To use it just add corsMiddleware() in the MIDDLEWARE list.
 * 
 * @returns {Function} - A function that will be executed in the request
 */
function corsMiddleware() {
    const cors = new CORS()

    return async (req, res, next) => {
        cors.handleCors(req, res)
        next()
    }
}


/**
 * Connverts the query string parameters from snake_case to camelCase so we comply better with 
 * Javascript default style guides.
 * 
 * @returns {Function} - A function that will be executed in the request as a middleware.
 */
function snakeToCamelCaseQueryParams() {
    return async (req, res, next) => {
        // needs to require here because otherwise it will generate circular dependency errors.
        const { snakeCaseToCamelCase } = require('./utils')

        const { query } = req
        const newQuery = {}

        for (let key in query) {
            const newKey = snakeCaseToCamelCase(key)
            newQuery[newKey] = query[key]
        }

        req.query = newQuery
        next()
    }
}
module.exports = {
    corsMiddleware,
    snakeToCamelCaseQueryParams
}