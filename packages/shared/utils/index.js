const delay = require('./delay')
const generateUUID = require('./generateUUID')
const deepCopy = require('./deepCopy')
const emailValidation = require('./emailValidation')
const base64 = require('./base64')
const httpStatus = require('./httpStatus')

module.exports = {
    httpStatus,
    base64,
    generateUUID,
    delay,
    deepCopy,
    emailValidation
}