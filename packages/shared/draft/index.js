const { base64 } = require('../utils')

const DRAFT_STRING_TEMPLATE = 'draft_{}'

/**
 * Checks if a string value is a draft. We know that strings are drafts if they follow the `DRAFT_STRING_TEMPLATE`
 * compliance.
 * 
 * @param {string} stringToTest - The string to check if it's a draft or not.
 * 
 * @returns {boolean} - True if the string is a draft, false otherwise.
 */
function isDraft(stringToTest) {
    const substringThatMustExistInStringToBeConsideredADraft = DRAFT_STRING_TEMPLATE.replace('{}', '')
    const isBase64 = base64.isBase64(stringToTest)
    if (isBase64 === false) return false
    
    const decodedString = base64.decode(stringToTest)
    if (decodedString.includes(substringThatMustExistInStringToBeConsideredADraft)) {
        return true
    } 
    return false
}

module.exports = {
    DRAFT_STRING_TEMPLATE,
    isDraft
}