const { strings } = require('../../../../../shared/constants')

function serverStrings(language, key) {
    let string = strings(language, 'server', key)
    if (string !== '') return string
    else {
        const defaultLanguage = 'pt-BR'
        string = strings(defaultLanguage, 'server', key)
        if (string !== '') return string
    }
    return ''
}

module.exports = serverStrings