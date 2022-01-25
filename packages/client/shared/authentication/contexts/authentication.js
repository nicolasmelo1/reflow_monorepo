import { createContext, useState, useEffect } from 'react'
import GlobalProvider, { setPersistState, getPersistState } from '../../core/contexts'

const initialState = {
    state: {
        isAuthenticated: false,
    },
    setIsAuthenticated: () => {},
}

export const AuthenticationContext = createContext(initialState)

/**
 * This context will be mostly used for mobile to check if the user is authenticated or not and change the routes.
 * That's the main idea. You will see that the state is just a simple `isAuthenticated` boolean indicating wheather the
 * user is authenticated or not.
 * 
 * This persist the state in the local storage so when we open the app again we will load the data from the storage and 
 * then redirect the user to one place or another.
 */
function AuthenticationProvider(props) {
    const [state, _setState] = useState(initialState.state)
    
    function setState(value) {
        setPersistState('authenticationContext', value)
        _setState(value)
    }

    function setIsAuthenticated(value) {
        setState({ isAuthenticated: value })
    }

    useEffect(() => {
        getPersistState('authenticationContext', state, _setState)
    }, [])

    return (
        <AuthenticationContext.Provider 
        value={{
            state,
            setIsAuthenticated,
        }}>
            {props.children}
        </AuthenticationContext.Provider>
    )
}
GlobalProvider.registerProviders(AuthenticationProvider)

export default AuthenticationContext
export { AuthenticationProvider }