import { createContext, useState } from 'react'
import GlobalProvider, { setPersistState, getPersistState } from '../../core/contexts'

const persistContext = 'homeTypesContext'
const initialState = {
    state: {
        areaTypes: []
    },
    setTypes: () => {},
    retrieveFromPersist: () => {},
}

const HomeTypesContext = createContext(initialState)

function HomeTypesProvider(props) {
    const [state, setState] = useState(initialState.state)

}

GlobalProvider.registerProviders(HomeTypesProvider)

export default HomeTypesContext
export { HomeTypesProvider }


