import { createContext, useState } from 'react'
import GlobalProvider, { setPersistState, getPersistState } from '../../core/contexts'

const persistState = 'appManagementTypesContext'
const initialState = {
    state: {
        types: {
            numberFormatTypes: [],
            dateFormatTypes: [],
            timeFormatTypes: [],
            fieldTypes: [],
        }
    },
    setTypes: () => {},
    retrieveFromPersist: () => {}
}

const AppManagementTypesContext = createContext(initialState)

/**
 * This state will hold all of the types for the `management` app. This app will be used for managing stuff. It's a program very similar to airtable, monday and
 * softwares like that. It has some "gotchas" that differentiate us from those apps. But in theory it is the same as those. So with this the users can manage
 * their projects, sales, and so on.
 * 
 * So the types are some ablogatory that we need in order for this application to work, without this, this application would definetly not work.
 */
const AppManagementTypesProvider = (props) => {
    const [state, setState] = useState(initialState.state)

    /**
     * This will set all of the types in the state of the context so we can use it in other components.
     * 
     * @param {Array<{
     *   id: number,
     *   name: string,
     *   precision: number,
     *   prefix: null | string,
     *   suffix: null | string,
     *   thousandSeparator: boolean,
     *   decimalSeparator: boolean,
     *   base: number
     * }>} numberFormatTypes - This is the formating of the number inside of the application. It's how we will show the numbers to user.
     * @param {Array<{id: number, name: string}>} dateFormatTypes - This is the format of the date, by default we don't know the date format, we imply that
     * based on the location of the user.
     * @param {Array<{id: number, name: string}>} timeFormatTypes - This is the format of the time, can be 24 or 12 hours.
     * @param {Array<{id: number, name: string}>} fieldTypes - This is all of the types that the fields can be inside of the formulary/listing and other parts of
     * the application.
     */
    function setTypes(numberFormatTypes, dateFormatTypes, timeFormatTypes, fieldTypes) {
        setPersistState(persistState, { 
            types: { 
                numberFormatTypes: numberFormatTypes, 
                dateFormatTypes: dateFormatTypes, 
                timeFormatTypes: timeFormatTypes, 
                fieldTypes: fieldTypes, 
            } 
        }, setState)
    }
    
    /**
     * Function for retrieving the state of the persist storage if we cannot retrieve it from the server (in case of a network error or something else).
     */
    function retrieveFromPersist() {
        getPersistState(persistState, state, setState)
    }

    return (
        <AppManagementTypesContext.Provider value={{
            state: state,
            setTypes: setTypes,
            retrieveFromPersist: retrieveFromPersist
        }}>
            {props.children}
        </AppManagementTypesContext.Provider>
    )
}

GlobalProvider.registerProviders(AppManagementTypesProvider)

export default AppManagementTypesContext
export { AppManagementTypesProvider }