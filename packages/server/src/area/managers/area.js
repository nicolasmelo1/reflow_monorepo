const { models } = require("../../../config/database")

class AreaAreaManager extends models.Manager {
    /**
     * This will retrieve all of the subareas of a particular area so we can have folders inside of the application.
     * 
     * @param {number} areaId - The id of the area that we are trying to retrieve the subareas for.
     * 
     * @returns {Promise<Array<Area>>} - The subareas of the area.
     */
    async subAreasByAreaId(areaId) {
        return await this.getInstance().findAll({
            where: {
                subAreaOfId: areaId
            }
        })
    }

    /**
     * Retrieves all of the areas that are not sub areas of a given workspace.
     * 
     * @param {number} workspaceId - The id of the workspace that we are trying to retrieve the areas for.
     * 
     * @returns {Promise<Array<Area>>} - The areas that are not sub areas of the workspace.
     */
    async areasByWorkspaceIdWithoutSubArea(workspaceId) {
        return await this.getInstance().findAll({
            where: {
                workspaceId: workspaceId,
                subAreaOfId: null
            }
        })
    }

    /**
     * Retrieves the id of the area that is associated with a given uuid.
     * 
     * @param {string} uuid - The uuid of the area that we are trying to retrieve the id for.
     * 
     * @returns {Promise<number>} - The id of the area.
     */
    async idByUUID(uuid) {
        const result = await this.getInstance().findOne({
            attributes: ['id'],
            where: {
                uuid: uuid
            }
        })
        return result !== null ? result.id : null
    }
}

module.exports = AreaAreaManager