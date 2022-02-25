
import { buildParser } from '@lezer/generator'
import flowLanguageLezer from './lezerParser'

let parserCache = null

/**
 * Responsible for creating a lezer parser of the flow language, so the first time it loads it takes some time
 * but after that it runs smoothly.
 * 
 * @param {Object} context - The context of the flow language.
 */
function flowLanguageParser(context) {
    if (parserCache === null) parserCache = buildParser(flowLanguageLezer(context))
    return parserCache
}

/**
 * Rebuilds the parser again, again it will need some time to build it.
 */
function rebuildCache(context) {
    parserCache = null
    return flowLanguageParser(context)
}

export default flowLanguageParser
export { rebuildCache }