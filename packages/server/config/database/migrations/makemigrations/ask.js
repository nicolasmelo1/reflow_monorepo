/**
 * @module config/database/migrations/makemigrations/ask
 */

const readlineSync = require('readline-sync')

/**
 * Responsible for asking user stuff like:
 * Did you rename a model in favor of another or did you rename a field?
 * 
 * Stuff like that
 * 
 * We have a second type of asker: where we prompt the user for selecting a Option like (1, 2, 3, and such)
 * This is ideal when we are not sure if a user made an action or not. So we prompt him to ask.
 */
const asker = {
    theNewAttributeCantHaveNullDoYouWishToContinue: (attributeName) => {
        const question = `\n\x1b[0mIf your model already have data, it can cause issues when migrating the new \x1b[36m${attributeName}\x1b[0m column ` + 
        `because you didn't set a \x1b[33mdefaultValue\x1b[0m or \x1b[33mallowNull \x1b[0mis set to \x1b[33mfalse\x1b[0m. \n`+
        `You can safely ignore this message if you didn't add any data to the table. \n\n` + `Press any key to continue or 'CTRL+C' to stop and define the attributes yourself.\n`

        const answer = readlineSync.question(question)
        if (answer.toLowerCase() === 'n') {
            return false
        } else {
            return true
        }
    },
    didUserRename: (modelThatWasRenamed, renamedTo) => {
        const question = `\nDid you rename '${modelThatWasRenamed}' to '${renamedTo}'? [y/n]\n`
        let answer = ''
        while (!['y', 'n'].includes(answer)) {
            answer = readlineSync.question(question)
            answer = answer.toLowerCase()
        }
        return answer === 'y'
    },
    didUserRenameToOneOption: (valueThatWasRenamed, renamedToOptions) => {
        const toOptions = renamedToOptions.map((renamedTo, index) => `${index+1}. ${renamedTo}`)
        const explanation = '\nPlease type the corresponding number or leave blank if you have not renamed'
        const question = `\nDid you rename '${valueThatWasRenamed}' to one of the following options? \n${toOptions.join('\n')} \n\n${explanation}\n`
        const answer = readlineSync.question(question)

        if (answer === '') {
            return false
        } else {
            try {
                return renamedToOptions[parseInt(answer) - 1]
            } catch {
                return false
            }
        }
    }
}

module.exports = asker