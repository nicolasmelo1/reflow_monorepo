import { createContext, useState } from 'react'
import GlobalProvider, { setPersistState, getPersistState } from '../../core/contexts'

const persistContext = 'formularyContext'
const initialState = {
    state: {
        formulary: {
            uuid: null,
            name: '',
            labelName: '',
            fields: []
        }
    },
    setFormulary: (appUUID, formulary, doesStateChange=true) => {},
    /**
     * Retrieves the formulary data from the persist storage when it cannot be loaded from the backend.
     * 
     * @param {string} appUUID - The uuid of the application that we are trying to retrieve the formulary data for. This will
     * load the formulary bounded to the specific app.
     * 
     * @returns {Promise<object>} - Returns the object that was inside of the state.
     */
    retrieveFromPersist: (appUUID, isToUpdateState=true) => {}
}

const FormularyContext = createContext(initialState)

/**
 * This context is responsible for holding the formulary data so we can render it on the screen. Similar to other 
 * stuff here in the application, we save the data of the formulary to the local storage so if we can't retreive
 * the formulary data from the backend for some reason we can still use the data we have saved in the cache.
 */
function FormularyProvider (props){
    const [state, setState] = useState(initialState.state)

    /**
     * Sets the formulary data to the state and persists it to the local storage so we can retrieve it if we don't have
     * internet connection.
     * 
     * @param {string} appUUID - The uuid of the application that we are trying to retrieve the formulary data for. This will
     * bound this formulary data to this app.
     * @param {object} formulary - The formulary data that we are trying to set to the state, this is retrieved 
     * from the backend.
     */
    function setFormulary(appUUID, formulary, doesStateChange=true) {
        const persistContextTitle = `${persistContext}_${appUUID}`
        const stateToPersist = { formulary: formulary }
        if (doesStateChange) {
            setPersistState(persistContextTitle, stateToPersist, setState)
        } else {
            setPersistState(persistContextTitle, stateToPersist)
        }
    }

    /**
     * Retrieves the formulary data from the persist storage when it cannot be loaded from the backend.
     * 
     * @param {string} appUUID - The uuid of the application that we are trying to retrieve the formulary data for. This will
     * load the formulary bounded to the specific app.
     * 
     * @returns {Promise<object>} - Returns the object that was inside of the state.
     */
    function retrieveFromPersist(appUUID, isToUpdateState=true) {
        const persistContextTitle = `${persistContext}_${appUUID}`
        if (isToUpdateState) {
            return getPersistState(persistContextTitle, initialState.state, setState)
        } else {
            return getPersistState(persistContextTitle, initialState.state)
        }
    }

    return (
        <FormularyContext.Provider 
        value={{
            state,
            setFormulary,
            retrieveFromPersist
        }}>
            {props.children}
        </FormularyContext.Provider>
    )
}

GlobalProvider.registerProviders(FormularyProvider)

export default FormularyContext
export { FormularyProvider }