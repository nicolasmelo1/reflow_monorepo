import { createContext, useState, useEffect } from 'react'
import GlobalProvider, { setPersistState, getPersistState } from '../../core/contexts'

const persistContext = 'homedefaultsContext'
const initialState = {
    state: {
        selectedApp: null
    },
    setSelectedApp: () => {}
}

const HomeDefaultsContext = createContext(initialState)

function HomeDefaultsProvider(props) {
    const [state, setState] = useState(initialState.state)

    function setSelectedApp(appUUID) {
        setPersistState(persistContext, { selectedApp: appUUID }, setState)
    }

    useEffect(() => {
        getPersistState(persistContext, setState)
    }, [])

    return (
        <HomeDefaultsContext.Provider value={{
            state,
            setSelectedApp
        }}>
            {props.children}
        </HomeDefaultsContext.Provider>
    )
} 

GlobalProvider.registerProviders(HomeDefaultsProvider)

export default HomeDefaultsContext
export { HomeDefaultsProvider }