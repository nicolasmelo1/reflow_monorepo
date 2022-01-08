import { createContext, useState } from 'react'
import GlobalProvider from '../../core/contexts'

const initialState = {
    state: {
        isEditingArea: false
    },
    setIsEditingArea: () => {}
}

const HomeContext = createContext(initialState)

/**
 * This will hold the state for the home page. When we create a new page we want the new page to be on `editing` mode. And that's exactly what this
 * is for. This will hold everything needed for the Home component that needs to be accessed from other components.
 */
function HomeProvider(props) {
    const [state, setState] = useState(initialState.state)

    function setIsEditingArea(isEditingArea) {
        setState({
            ...state,
            isEditingArea
        })
    }

    return (
        <HomeContext.Provider value={{
            state,
            setIsEditingArea
        }}>
            {props.children}
        </HomeContext.Provider>
    )
}

GlobalProvider.registerProviders(HomeProvider)


export default HomeContext
export { HomeProvider } 