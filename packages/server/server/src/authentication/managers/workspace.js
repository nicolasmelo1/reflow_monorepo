const { models } = require('../../../../palmares/database')

class WorkspaceAuthenticationManager extends models.Manager {
    /**
     * This method will be used to retrieve the workspace by the given uuid.
     * 
     * @param {string} uuid - The uuid of the workspace to be retrieved.
     * 
     * @returns {Promise<Workspace>} - The workspace that matches the given uuid.
     */
    async workspaceByUUID(uuid) {
        return await this.getInstance().findOne({
            where: {
                uuid: uuid
            }
        })
    }

    /**
     * This will retrive all of the workspaces by a list of workspace ids given.
     * 
     * @param {Array<number>} workspaceIds - An array of workspace ids to retrieve the workspaces for.
     * 
     * @returns {Promise<Array<Workspace>>} - An array of workspaces that match the given ids.
     */
    async workspacesByWorkspaceIds(workspaceIds) {
        const { operations } = this.getEngineInstance()
        return await this.getInstance().findAll({
            where: {
                id: {
                    [operations.in]: workspaceIds
                }
            }
        })
    }
}

module.exports = WorkspaceAuthenticationManager
