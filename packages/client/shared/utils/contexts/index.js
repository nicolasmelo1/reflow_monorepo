import dynamicImport from "../../utils/dynamicImport"

const AsyncStorage = dynamicImport('@react-native-async-storage/async-storage')

/**
 * This will get the state for a given contextName. With this we are able to store the state of a given context in
 * the memory of the application. So when the user opens again we are able to load data from this state.
 * 
 * @param {string} contextName - The name of the context that we want to get the state for.
 * 
 * @returns {object} - The state of the context.
 */
export async function getPersistState(contextName) {
    if (process.env['APP'] === 'web' && window.localStorage !== undefined && localStorage !== undefined) {
        const state = localStorage.getItem(contextName)
        if (state !== null) return JSON.parse(state)
        else return null
    } else if (process.env['APP'] !== 'web') {
        try {
            const state = await AsyncStorage.getItem(contextName)
            if (state !== null) return JSON.parse(state)
        } catch (e) {}

        return null
    }
}

/**
 * 
 */
export async function setPersistState(contextName, state) {
    if (process.env['APP'] === 'web' && window.localStorage !== undefined && localStorage !== undefined) {
        localStorage.setItem(contextName, JSON.stringify(state))
    } else if (process.env['APP'] !== 'web') {
        await AsyncStorage.setItem(contextName, JSON.stringify(state))
    }
}