const serializers = require('../../../../palmares/serializers')

const { Workspace, UserWorkspaces, ProfileType } = require('../models')

/**
 * This is used to retrieve all of the workspaces that are active that a specific user user is a member of.
 * 
 * By doing this we are able to render the workspace list to the front-end
 */
class WorkspaceRelation extends serializers.ModelSerializer {
    async toRepresentation(userId) {
        let profileTypeIdByWorkspaceIdReference = {}
        const workspaceIdsAndProfileTypeIds = await UserWorkspaces.AUTHENTICATION.workspaceIdsAndProfileIdsByUserIdAndIsActive(userId)
        const workspaceIds = workspaceIdsAndProfileTypeIds.map(({ workspaceId, profileTypeId }) => {
            profileTypeIdByWorkspaceIdReference[workspaceId] = profileTypeId
            return workspaceId
        })
        const data = (await Workspace.AUTHENTICATION.workspacesByWorkspaceIds(workspaceIds)).map(workspace => {
            workspace.profileTypeId = profileTypeIdByWorkspaceIdReference[workspace.id]
            return workspace
        })
        return await super.toRepresentation(data)
    }

    fields = {
        profileTypeId: new serializers.IntegerField(),
    }

    options = {
        model: Workspace,
        fields: ['createdAt', 'name', 'endpoint', 'uuid', 'logoImageUrl']
    }
}

class ProfileTypeRelation extends serializers.ModelSerializer {
    options = {
        model: ProfileType,
        exclude: ['order']
    }
}

class LocationTypeRelation extends serializers.ModelSerializer {
    options = {
        model: LocationType,
        exclude: ['order']
    }
}

module.exports = {
    WorkspaceRelation,
    ProfileTypeRelation,
    LocationTypeRelation
}