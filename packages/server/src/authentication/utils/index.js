/** @module src/authentication/utils */

const JWT = require('./jwtAuth')

/**
 * Check if a given uuid is a valid UUID.
 * 
 * @param {string} uuid - The uuid to check.
 * 
 * @returns {boolean} - true if valid, false otherwise
 */
function isValidUUID(uuid) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid)
}

module.exports = {
    JWT,
    isValidUUID
}