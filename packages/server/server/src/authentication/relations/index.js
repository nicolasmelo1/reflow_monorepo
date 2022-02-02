const serializers = require('../../../../palmares/serializers')

const { 
    Workspace, 
    UserWorkspaces, 
    ProfileType, 
    LocationType 
} = require('../models')
// ------------------------------------------------------------------------------
/**
 * This is used to retrieve all of the workspaces that are active that a specific user user is a member of.
 * 
 * By doing this we are able to render the workspace list to the front-end
 */
class WorkspaceRelation extends serializers.ModelSerializer {
    async toRepresentation(userId) {
        let profileTypeIdByWorkspaceIdReference = {}
        const adminProfileTypeId = await ProfileType.AUTHENTICATION.adminProfileTypeId()
        const workspaceIdsAndProfileTypeIds = await UserWorkspaces.AUTHENTICATION.workspaceIdsAndProfileIdsByUserIdAndIsActive(userId)
        const workspaceIds = workspaceIdsAndProfileTypeIds.map(({ workspaceId, profileTypeId }) => {
            profileTypeIdByWorkspaceIdReference[workspaceId] = profileTypeId
            return workspaceId
        })
        const data = (await Workspace.AUTHENTICATION.workspacesByWorkspaceIds(workspaceIds)).map(workspace => {
            const profileTypeIdForWorkspace = profileTypeIdByWorkspaceIdReference[workspace.id]
            workspace.isAdmin = profileTypeIdForWorkspace === adminProfileTypeId
            workspace.profileTypeId = profileTypeIdForWorkspace
            return workspace
        })
        return await super.toRepresentation(data)
    }

    fields = {
        isAdmin: new serializers.BooleanField(),
        profileTypeId: new serializers.IntegerField(),
    }

    options = {
        model: Workspace,
        fields: ['createdAt', 'name', 'endpoint', 'uuid', 'logoImageUrl']
    }
}
// ------------------------------------------------------------------------------
/** 
 * Relation for holding the all of the profile types that are available in the application, this will return when the user logs
 * in the platform, with that we can know in the front-end the profile type that the user has, is he an admin, a collaborator? and so on.
 * Also, what can the collaborator do in the application?
 */
class ProfileTypeRelation extends serializers.ModelSerializer {
    options = {
        model: ProfileType,
        exclude: ['order']
    }
}

/**
 * Relation that will hold all of the locations that the platform is located, this way we can translate the platform, the Flow language
 * and whatever. This comes directly from the backend instead of the front-end. So if the user is a brazilian traveling to germany,
 * nothing will ever change for him.
 */
class LocationTypeRelation extends serializers.ModelSerializer {
    options = {
        model: LocationType,
        exclude: ['order']
    }
}
// ------------------------------------------------------------------------------

module.exports = {
    WorkspaceRelation,
    ProfileTypeRelation,
    LocationTypeRelation
}