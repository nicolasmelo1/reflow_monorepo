/**
 * Converts a snake_case string to a camelCase string formatting, really easy.

 * @param {string} string - The string to convert from snale to camel

 * @returns {String} - The converted string. 
 */
function snakeCaseToCamelCase(string) {
    return string.toLowerCase().replace(/([-_][a-z])/g, group => {
        return group.toUpperCase().replace('-', '').replace('_', '')
    })
}

/**
 * Converts a camelCase string to a snake case string formatting, really easy.
 * 
 * @param {String} string - The string to convert from camel to snake
 * 
 * @returns {String} - The converted string. 
 */
function camelCaseToSnakeCase(string) {
    return string.replace(/[A-Z]+/g, letter => `_${letter.toLowerCase()}`)
}

module.exports = {
    snakeCaseToCamelCase,
    camelCaseToSnakeCase,
    fileUpload: require('./fileUpload'),
    Encrypt: require('./encrypt'),
    CORS: require('./cors'),
    Bucket: require('./storage'),
    strings: require('./strings')
}