
import { buildParser } from '@lezer/generator'
import flowLanguageLezer from './lezerParser'

let parserCache = null
let contextCache = null

/**
 * Responsible for creating a lezer parser of the flow language, so the first time it loads it takes some time
 * but after that it runs smoothly.
 * 
 * @param {Object} context - The context of the flow language.
 */
function flowLanguageParser(context) {
    const stringfiedContext = JSON.stringify(context)
    if (parserCache === null || contextCache !== stringfiedContext) {
        parserCache = buildParser(flowLanguageLezer(context))
        contextCache = stringfiedContext
    }
    return parserCache
}

export default flowLanguageParser
