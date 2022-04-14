import { requests } from '../core/agent'

/**
 * This will load all of the workspaces in the sidebar.
 * 
 * @param {string} workspaceUUID - The uuid of the workspace we are interacting with.
 * 
 * @returns {Promise<import('axios').Response>} - Returns an axios response containing all of 
 * the areas in an array.
 */
function getAreas(workspaceUUID) {
    return requests.get(`/area/${workspaceUUID}/areas`)
}

/**
 * This will update the area in the backend. So whatever we do in the frontend will be reflected to the backend
 * of the application.
 * 
 * @param {string} workspaceUUID - The uuid of the workspace we are interacting with.
 * @param {string} areaUUID - The uuid of the area we are making changes to.
 * @param {object} area - The data of the area that we want to send to the backend.
 * 
 * @returns {Promise<import('axios').Response>} - Returns an axios response containing the data saying if everything went well.
 */
function updateArea(workspaceUUID, areaUUID, area) {
    return requests.put(`/area/${workspaceUUID}/areas/${areaUUID}`, { body: area })
}

/**
 * This api will create a new area in the backend database. When we use this we create only a single area in the database.
 * 
 * @param {string} workspaceUUID - The uuid of the workspace we are interacting with.
 * @param {object} area - The data of the area that we want to send to the backend.
 * 
 * @returns {Promise<import('axios').Response>} - Returns an axios response containing the data saying if everything went well. This will send a 201 status code if
 * everything went well.
 */
function createArea(workspaceUUID, area) {
    return requests.post(`/area/${workspaceUUID}/areas`, { body: area })
}

/**
 * This api will delete an area from the backend database. 
 * 
 * @param {string} workspaceUUID - The uuid of the workspace we are interacting with.
 * @param {string} areaUUID - The uuid of the area we are deleting.
 * 
 * @returns {Promise<import('axios').Response>} - Returns an axios response containing the data saying if everything went well and returning
 * the response from the server.
 */
function removeArea(workspaceUUID, areaUUID) {
    return requests.delete(`/area/${workspaceUUID}/areas/${areaUUID}`)
}

export default {
    getAreas,
    updateArea,
    createArea,
    removeArea,
}