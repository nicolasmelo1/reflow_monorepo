import { createContext, useState } from 'react'
import GlobalProvider, { setPersistState, getPersistState } from '../../core/contexts'

const persistContext = 'formularyContext'
const initialState = {
    state: {
        formulary: {
            uuid: null,
            name: '',
            labelName: '',
            sections: []
        }
    },
    setFormulary: () => {},
    retrieveFromPersist: (appUUID) => {}
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
    function setFormulary(appUUID, formulary) {
        setPersistState(`${persistContext}_${appUUID}`, { formulary: formulary }, setState)
    }

    function retrieveFromPersist(appUUID) {
        getPersistState(`${persistContext}_${appUUID}`, initialState.state, setState)
    }

    return (
        <FormularyContext.Provider value={{
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