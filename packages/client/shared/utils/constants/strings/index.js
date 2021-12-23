import ptBR from './pt-BR'

const languagePack = {
    'pt-BR': ptBR
}

/**
 * This is responsible for returning a text label on a given language. For example:
 * instead of directly wiritting: 
 * 
 * 'Cadastro' in the button you will write:
 * {strings('pt-BR', 'loginOnboardingButtonLabel')}
 * 
 * And then you will define what `loginOnboardingButtonLabel` means inside the `pt-BR` file. If you want
 * to support another language, just create a new file and add the texts to the language pack.
 * 
 * @param {string} language - One of the supported languages. See `languagePack` variable up here for reference.
 * @param {string} key - The key of the text label.
 * 
 * @returns {string} - The text label to use in your component.
 */
function strings(language, key) {
    return languagePack[language][key]
}

export default strings