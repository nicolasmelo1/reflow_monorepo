import { requests } from "../core/agent"


async function getFormularyTypes(source, workspaceUUID, appUUID) {
    return await requests.get(`/app/${workspaceUUID}/management/${appUUID}/formulary/types`, { source: source })
}

export default {
    getFormularyTypes
}