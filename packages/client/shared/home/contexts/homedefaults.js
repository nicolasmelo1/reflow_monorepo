import { createContext, useState, useEffect } from 'react'
import GlobalProvider, { setPersistState, getPersistState } from '../../core/contexts'
import { strings } from '../../core/utils/constants'

const persistContext = 'homedefaultsContext'
const initialState = {
    state: {
        selectedApp: null,
        selectedArea: {
            uuid: null,
            description: "",
            color: null,
            labelName: strings('pt-BR', 'workspaceNoWorkspaceSelected'),
            name: "",
            order: 0,
            subAreas: [],
            apps: [],
        }
    },
    setState: () => {},
    setSelectedApp: () => {},
    setSelectedArea: () => {}
}

const HomeDefaultsContext = createContext(initialState)

function HomeDefaultsProvider(props) {
    const [state, _setState] = useState(initialState.state)

    /**
     * This will set the state directly in the context. It will change at the same time the `appUUID` selected and the `area` selected.
     * By enabling this you don't run in issues.
     * 
     * @param {string | null} appUUID - The uuid of the app that is being selected.
     * @param {object} area - The area object that is being selected.
     */
    function setState(appUUID, areaData) {
        setPersistState(persistContext, { selectedApp: appUUID, selectedArea: areaData }, _setState)
    }
    
    function setSelectedApp(appUUID) {
        setPersistState(persistContext, { ...state, selectedApp: appUUID }, _setState)
    }

    function setSelectedArea(areaData) {
        setPersistState(persistContext, { ...state, selectedArea: areaData }, _setState)
    }

    /*useEffect(() => {
        getPersistState(persistContext, state, _setState)
    }, [])*/

    return (
        <HomeDefaultsContext.Provider value={{
            state,
            setState,
            setSelectedApp,
            setSelectedArea
        }}>
            {props.children}
        </HomeDefaultsContext.Provider>
    )
} 

GlobalProvider.registerProviders(HomeDefaultsProvider)

export default HomeDefaultsContext
export { HomeDefaultsProvider }