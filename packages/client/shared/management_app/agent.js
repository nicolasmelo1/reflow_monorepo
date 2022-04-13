import { requests } from "../core/agent"


async function getFormularyTypes(source, workspaceUUID, appUUID) {
    return await requests.get(
        `/app/${workspaceUUID}/management/${appUUID}/formulary/types`, 
        { source: source, cacheSeconds: 86400 }
    )
}

async function getFormulary(source, workspaceUUID, appUUID) {
    return await requests.get(`/app/${workspaceUUID}/management/${appUUID}/formulary`, { source: source })
}

export default {
    getFormularyTypes,
    getFormulary
}