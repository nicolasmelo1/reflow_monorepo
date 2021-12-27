import { createContext, useState, useEffect } from 'react'
import { setPersistState, getPersistState } from '../../../utils/contexts'
import GlobalProvider from '../../Core/contexts'

const initialState = {
    state: {
        isAuthenticated: false,
    },
    setIsAuthenticated: () => {},
}

export const AuthenticationContext = createContext(initialState)

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
        getPersistState('authenticationContext').then(state => {
            if (state !== null) {
                _setState(state)
            }
        })
    }, [])

    return (
        <AuthenticationContext.Provider value={{
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