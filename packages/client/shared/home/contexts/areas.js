import { createContext, useState } from 'react'
import GlobalProvider, { setPersistState, getPersistState } from '../../core/contexts'

const persistContext = 'areasContext'
const initialState = {
    state: {
        areas: [],
    },
    setAreas: () => {},
    retrieveFromPersist: () => {}
}

const AreaContext = createContext(initialState)

/**
 * This will hold the state of the areas. Areas are known as `workspaces` in the frontend. Areas can have
 * multiple apps. Each app should obligatorily be assigned to an area (or workspace).
 * 
 * This is what we use to load the sidebar.
 */
function AreaProvider(props) {
    const [state, setState] = useState(initialState.state)

    function setAreas(areas) {
        setPersistState(persistContext, { areas: areas }, setState)
    }

    /**
     * If you cannot call the API you can call this function and we will load the data from the persist storage.
     */
    function retrieveFromPersist() {
        getPersistState(persistContext, setState)
    }

    return (
        <AreaContext.Provider value={{
            state,
            areas: state.areas,
            retrieveFromPersist,
            setAreas,
        }}>
            {props.children}
        </AreaContext.Provider>
    )
}

GlobalProvider.registerProviders(AreaProvider)

export default AreaContext
export { AreaProvider }