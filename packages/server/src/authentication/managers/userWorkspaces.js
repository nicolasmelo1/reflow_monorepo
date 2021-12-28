const { models } = require("../../../config/database")


class UserWorkspacesAuthenticationManager extends models.Manager {
    /**
     * Retrieves all of the user workspaces by the given user id and all of the profile Ids for each workspace.
     * 
     * @param {number} userId - The id of the user to retrieve the workspaces for.
     * 
     * @returns {Promise<Array<{workspaceId: number, profileTypeId: number}>>} - An array of objects containing the 
     * workspace id and the profile type id.
     */
    async workspaceIdsAndProfileIdsByUserIdAndIsActive(userId) {
        return await this.getInstance().findAll({
            attributes: ['workspaceId', 'profileTypeId'],
            where: {
                userId: userId,
                isActive: true
            }
        })
    }
}

module.exports = UserWorkspacesAuthenticationManager