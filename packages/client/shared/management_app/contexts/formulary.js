import { createContext, useState } from 'react'
import GlobalProvider, { setPersistState, getPersistState } from '../../core/contexts'

const persistContext = 'formularyContext'
const initialState = {
    state: {
        formulary: null
    },
    setFormulary: () => {},
    retrieveFromPersist: (appUUID) => {}
}

const FormularyContext = createContext(initialState)

function FormularyProvider (props){
    const [state, setState] = useState(initialState.state)

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