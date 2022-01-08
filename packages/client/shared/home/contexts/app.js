import { createContext, useState } from 'react'
import GlobalProvider, { setPersistState, getPersistState } from '../../core/contexts'

const persistContext = 'appContext'
const initialState = {
    state: {
        app: null
    },
    setApp: () => {},
    retrieveFromPersist: () => {}
}

const AppContext = createContext(initialState)

/**
 * This is responsible for loading the app. This will load stuff like the name of the app, the order, and other stuff like
 * it's configuration data, the actual app that was selected and so on. (The app selected is what app this is using, for example),
 * some app can be the automations app, another app can be the management app. And so on, each app is specific to solve one thing.
 */
function AppProvider(props) {
    const [state, setState] = useState(initialState.state)

    /**
     * When we save the state, we will save it to the local storage, but we will not
     * save it like the other persist states. What we do is save it with the uuid of the app.
     * So if we don't have internet connection we can actually retrieve it again from the storage.
     */
    function setApp(app) {
        setPersistState(`${persistContext}_${app.uuid}`, { app: app }, setState)
    }
    
    function retrieveFromPersist(appUUID) {
        getPersistState(`${persistContext}_${appUUID}`, state, setState)
    }

    return (
        <AppContext.Provider value={{
            state,
            setApp,
            retrieveFromPersist
        }}>
            {props.children}
        </AppContext.Provider>
    )
}

GlobalProvider.registerProviders(AppProvider)

export default AppContext
export { AppProvider }