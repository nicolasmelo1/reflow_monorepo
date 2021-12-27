import { createContext, useState, useEffect } from 'react'
import { setPersistState, getPersistState } from '../../../utils/contexts'
import GlobalProvider from '../../Core/contexts'

const initialState = {
    state: {
        id: 1,
        firstName: 'Nicolas'
    },
    setIsAuthenticated: () => {},
}

export const UserContext = createContext(initialState)

function UserProvider(props) {
    const [state, _setState] = useState(initialState.state)
    
    function setState(value) {
        setPersistState('userContext', value)
        _setState(value)
    }


    useEffect(() => {
        getPersistState('userContext').then(state => {
            if (state !== null) {
                _setState(state)
            }
        })
    }, [])

    return (
        <UserContext.Provider value={{
            state,
            setState,
        }}>
            {props.children}
        </UserContext.Provider>
    )
}

GlobalProvider.registerProviders(UserProvider)

export default UserContext
export { UserProvider }