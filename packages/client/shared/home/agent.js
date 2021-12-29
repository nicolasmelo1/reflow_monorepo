import { requests } from '../core/agent'


function getAreas(workspaceId) {
    return requests.get(`/area/${workspaceId}/areas`)
}

export default {
    getAreas
}