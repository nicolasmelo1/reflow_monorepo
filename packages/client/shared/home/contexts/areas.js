import { createContext, useState } from 'react'
import GlobalProvider, { setPersistState, getPersistState } from '../../core/contexts'

const persistContext = 'areasContext'
const initialState = {
    state: {
        areas: [],
        nonUniqueAreaUUIDs: []
    },
    setAreas: () => {},
    retrieveFromPersist: () => {},
    recursiveTraverseAreas: async () => {},
}

const AreaContext = createContext(initialState)

/**
 * This will hold the state of the areas. Areas are known as `workspaces` in the frontend. Areas can have
 * multiple apps. Each app should obligatorily be assigned to an area (or workspace).
 * 
 * This is what we use to load the sidebar.
 */
function AreaProvider(props) {
    const [state, setState] = useState(initialState.state)
    
    /**
     * This will recursively traverse all of the areas of the application and return the area when a certain condition is satisfied.
     * 
     * The condition is a callback that we send, it is a function we recieve in this function and that we call passing only the area
     * to check if it satisfies a condition or not.
     * 
     * @param {(area: object) => boolean} condition - The condition that we will check if the area satisfies so we return the area object.
     * @param {Array<{
     *  uuid: string, 
     *  description: string, 
     *  color: string | null,
     *  labelName: string,
     *  name: string,
     *  order: number,
     *  subAreas: Array<object>,
     *  subAreaOfUUID: string,
     *  apps: Array<{}>
     * }> | null} areasToConsider - An array with all of the areas of the application. If this is set to null
     * we will use the areas from the AreasContext.
     * 
     * @returns {Promise<{
     *  uuid: string, 
     *  description: string, 
     *  color: string | null,
     *  labelName: string,
     *  name: string,
     *  order: number,
     *  subAreas: Array<object>,
     *  subAreaOfUUID: string,
     *  apps: Array<{}>
     * }>} - Returns the area found that satisfies the condition specified.
     */
    async function recursiveTraverseAreas(foundCallback, areasToConsider=null) {
        if (areasToConsider === null) areasToConsider = state.areas
        async function traverse(areas) {
            let order = 0
            for (const area of areas) {
                area.order = order
                if (foundCallback(area)) {
                    return area
                } else if (area.subAreas && area.subAreas.length > 0) {
                    const result = await traverse(area.subAreas)
                    if (result !== null) {
                        return result
                    }
                }
                order++
            }
            return null
        }
        return await traverse(areasToConsider)
    }
    
    /**
     * This will traverse all of the areas and see if each area has a unique name.
     * The areas that does not have unique names will be added to the nonUniqueAreaUUIDs array.
     * And then we will update the state.
     * 
     * @param {Array<object>} areas - An array with all of the areas of the application.
     */
    async function checkIfAreasHaveEqualNames(areas) {
        const areaNameByUUIDsReference = {}
        let sameNameAreasUUIDs = []
        await recursiveTraverseAreas(area => {
            const areaUUIDsOfAreaLabelName = areaNameByUUIDsReference[area.labelName]
            if (areaUUIDsOfAreaLabelName === undefined) {
                areaNameByUUIDsReference[area.labelName] = [area.uuid]
            } else {
                sameNameAreasUUIDs = [...new Set([...sameNameAreasUUIDs, ...areaUUIDsOfAreaLabelName, area.uuid])]
                areaNameByUUIDsReference[area.labelName].push(area.uuid)
            }
            return false
        }, areas)
        const newState = {
            nonUniqueAreaUUIDs: sameNameAreasUUIDs, areas: areas
        }
        setPersistState(persistContext, newState, setState)
        return newState
    }

    /**
     * This function will return a promise of the new state of the app. By returning this new state we are able to know if the areas 
     * has repeated names or not. We are also able to know the state of the area before continuing.
     * 
     * @param {Array<object>} areas - An array with all of the areas of the application.
     * 
     * @returns {Promise<{
     *   nonUniqueAreaUUIDs: Array<string>,
     *   areas: Array<object>
     * }>} - Returns the new state of the app.
     */
    async function setAreas(areas) {
        return await checkIfAreasHaveEqualNames(areas)
    }

    /**
     * If you cannot call the API you can call this function and we will load the data from the persist storage.
     * 
     * @return {Promise<object>} - Returns the new state of the app.
     */
    function retrieveFromPersist() {
        return getPersistState(persistContext, state, setState)
    }

    return (
        <AreaContext.Provider value={{
            state,
            areas: state.areas,
            nonUniqueAreaUUIDs: state.nonUniqueAreaUUIDs,
            recursiveTraverseAreas,
            retrieveFromPersist,
            setAreas,
        }}>
            {props.children}
        </AreaContext.Provider>
    )
}

GlobalProvider.registerProviders(AreaProvider)

export default AreaContext
export { AreaProvider }