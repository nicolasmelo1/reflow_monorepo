import { createContext, useState, useEffect } from 'react'
import GlobalProvider, { setPersistState, getPersistState } from '../../core/contexts'
import { strings } from '../../core/utils/constants'

const persistContext = 'homedefaultsContext'
const initialState = {
    state: {
        selectedApp: {
            uuid: null,
            labelName: strings('pt-BR', 'workspaceNoAppSelected'),
            description: '',
            name: '',
            order: 1
        },
        selectedArea: {
            uuid: null,
            description: "",
            color: null,
            labelName: strings('pt-BR', 'workspaceNoWorkspaceSelected'),
            name: "",
            order: 1,
            subAreas: [],
            apps: [],
        }
    },
    setState: () => {},
    setSelectedApp: () => {},
    setSelectedArea: () => {},
    retrieveFromPersist: () => {}
}

const HomeDefaultsContext = createContext(initialState)

function HomeDefaultsProvider(props) {
    const [state, _setState] = useState(initialState.state)

    /**
     * This will set the state directly in the context. It will change at the same time the `appUUID` selected and the `area` selected.
     * By enabling this you don't run in issues.
     * 
     * You can send null to both parameters, if one of them is null then we will set the initial state.
     * 
     * @param {{
     *      uuid: string | null,
     *      labelName: string,
     *      description: string,
     *      name: string,
     *      order: number
     * } | null} appData - The app object that is being selected.
     * @param {{
     *      uuid: string | null,
     *      description: string,
     *      color: null | string,
     *      labelName: string,
     *      name: string,
     *      order: number,
     *      subAreas: Array<areaData>,
     *      apps: Array<appData>
     * } | null} areaData - The area object that is being selected.
     */
    function setState(appData=null, areaData=null) {
        appData = appData === null ? initialState.state.selectedApp : appData
        areaData = areaData === null ? initialState.state.selectedArea : areaData
        setPersistState(persistContext, { selectedApp: appData, selectedArea: areaData }, _setState)
    }

    /**
     * Set the selected app data in the state.
     * 
     * @param {{
     *      uuid: string | null,
     *      labelName: string,
     *      description: string,
     *      name: string,
     *      order: number
     * }} appData - The app object that is being selected.
     */
    function setSelectedApp(appData) {
        setPersistState(persistContext, { ...state, selectedApp: appData }, _setState)
    }
    
    /**
     * Sets the selected area data in the state.
     * 
     * @param {{
     *      uuid: string | null,
     *      description: string,
     *      color: null | string,
     *      labelName: string,
     *      name: string,
     *      order: number,
     *      subAreas: Array<areaData>,
     *      apps: Array<object>
     * }} areaData - The area object that is being selected.
     */
    function setSelectedArea(areaData) {
        setPersistState(persistContext, { ...state, selectedArea: areaData }, _setState)
    }
    
    function retrieveFromPersist() {
        return getPersistState(persistContext, state, _setState)
    }

    useEffect(() => {
        getPersistState(persistContext, state, _setState)
    }, [])

    return (
        <HomeDefaultsContext.Provider value={{
            state,
            setState,
            setSelectedApp,
            setSelectedArea,
            retrieveFromPersist
        }}>
            {props.children}
        </HomeDefaultsContext.Provider>
    )
} 

GlobalProvider.registerProviders(HomeDefaultsProvider)

export default HomeDefaultsContext
export { HomeDefaultsProvider }