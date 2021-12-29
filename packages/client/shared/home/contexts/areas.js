import { createContext, useState, useEffect, useRef } from 'react'
import GlobalProvider, { setPersistState, getPersistState } from '../../core/contexts'

const persistContext = 'areasContext'
const initialState = {
    state: {
        areas: [],
    },
    setAreas: () => {}
}

const AreaContext = createContext(initialState)

function AreaProvider(props) {
    const [state, _setState] = useState(initialState.state)

    function setState(value) {
        setPersistState(persistContext, value)
        _setState(value)
    }

    function setAreas(areas) {
        setState({ areas: areas })
    }

    useEffect(() => {
        getPersistState(persistContext).then(state => {
            if (state !== null) {
                _setState(state)
            }
        })
    }, [])

    return (
        <AreaContext.Provider value={{
            state,
            areas: state.areas,
            setAreas,
        }}>
            {props.children}
        </AreaContext.Provider>
    )
}

GlobalProvider.registerProviders(AreaProvider)

export default AreaContext
export { AreaProvider }