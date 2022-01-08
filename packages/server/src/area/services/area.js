const { Area } = require('../models')

class AreaService {
    /**
     * @param {number} workspaceId - The id of the workspace where the area reasides in.
     * This is basically the company of the area.
     * @param {number} userId - The id of the user that is interacting with the area.
     */
    constructor(workspaceId, userId) {
        this.workspaceId = workspaceId
        this.userId = userId
    }

    /**
     * This will create an area name from the labelName for the area. The area name is like an id. That can be used inside urls.
     * 
     * It is unique for each workspace and it extract spaces, accents and all special characters that are not valid inside
     * of urls.
     * 
     * We can use this to create an area through an API or to interact with an area with API and so on.
     * 
     * @param {string} labelName - The label name of the area. THis means the name of the area.
     * @param {string | null} areaUUID - The uuid of the area. We use this if we are editing an area. So we can ignore this uuid.
     * 
     * @returns {Promise<string>} - The area name.
     */
    async createAreaNameFromLabelName(labelName, areaUUID=null) {
        let areaName = labelName.normalize("NFD").replace(/\p{Diacritic}/gu, '').replace(/\s+/g, '_').toLowerCase()
        let doesAreaNameExists = await Area.AREA.existsByWorkspaceIdAndAreaNameExcludingAreaUUIDIfExists(
            this.workspaceId, areaName, areaUUID
        )
        while (doesAreaNameExists) {
            areaName = `${areaName}_${Math.floor(Math.random() * 1000)}`
            doesAreaNameExists = await Area.AREA.existsByWorkspaceIdAndAreaNameExcludingAreaUUIDIfExists(
                this.workspaceId, areaName, areaUUID
            )
        }
        return areaName
    }

    /**
     * This function will check if the labelName of the area is unique or not. If it is unique, it will return true and if not unique it will return false.
     * In order to save the data we need to be sure that the labelName is unique for the workspace. A workspace can have one, and only one area with the same labelName.
     * 
     * @param {string} labelName - The label name of the area.
     * @param {string | null} areaUUID - The uuid of the area. We use this if we are editing an area. So we can ignore this uuid.
     * 
     * @returns {Promise<boolean>} - True if the labelName is unique, false if not.
     */
    async isLabelNameUnique(labelName, uuid=null) {
        return !(await Area.AREA.existsByWorkspaceIdAndLabelNameIgnoringUUIDIfDefined(
            this.workspaceId, labelName, uuid
        ))
    }

    /**
     * This function will create or update an area. To update an area you must define `uuid` with the uuid of the area that you want to update.
     * Also, this uuid must exist in the database.
     * 
     * @param {object} area - The area that you want to create or update.
     * @param {string} area.uuid - The uuid of the area you are creating or updating. This uuid is always obligatory and must be generated in the front end.
     * @param {string} area.labelName - The label name of the area. This must be unique for a given workspace.
     * @param {string | null} area.description - The description of the area.
     * @param {string | null} area.color - The color of the area, this is the color we show in the front-end background.
     * @param {number} area.order - The order of the area. This is the order we show the areas in the front-end. For example, which area comes first and which
     * comes last? We do not use the id, instead we use this order value to set the order of the fields.
     * @param {string | null} area.subAreaOfUUID - The uuid of this area is subAreaOf. In other words, this area is a child from the area with this uuid.
     * The uuid sent here is the parent.
     * @param {import('sequelize').Transaction} transaction - The transaction that will be used to save the data in the database so if any error happens we can rollback
     * the changes.
     */
    async createOrUpdate({ uuid, labelName, description, color, order, subAreaOfUUID=null } = {}, transaction) {
        const doesAreaExists = await Area.AREA.existsByUUID(uuid)
        const subAreaId = subAreaOfUUID !== null ? await Area.AREA.idByUUID(subAreaOfUUID) : null
        const areaName = await this.createAreaNameFromLabelName(labelName, uuid)
        
        if (doesAreaExists) {
            await Area.AREA.updateArea({
                uuid,
                labelName,
                name: areaName,
                description,
                color,
                order,
                workspaceId: this.workspaceId,
                subAreaOfId: subAreaId
            }, transaction)
        } else {
            await Area.AREA.createArea({
                uuid,
                labelName,
                name: areaName,
                description,
                color,
                order,
                workspaceId: this.workspaceId,
                subAreaOfId: subAreaId
            }, transaction)
        }
    }

    /**
     * This will reorder the areas when an area is removed. So we can guarantee all areas will always be in order.
     * 
     * @param {import('sequelize').Transaction} transaction - The transaction that will be used to update the order of the areas.
     */
    async #reorderAreas(transaction) {
        const areaInstances = await Area.AREA.areasByWorkspaceId(this.workspaceId)
        let currentOrderBySubAreaOfId = {}
        let toResolve = []
        for (const area of areaInstances) {
            const currentOrderBasedOnSubAreaOfId = currentOrderBySubAreaOfId[area.subAreaOfId]
            const order = currentOrderBasedOnSubAreaOfId !== undefined ? currentOrderBasedOnSubAreaOfId + 1 : 0
            currentOrderBySubAreaOfId[area.subAreaOfId] = order
            // We make it this way so we make it resolve faster. everything will return a promise so this means we will loop through all the areas
            // really quick. Then before continuing we need to make sure all promises have been resolved, but we do not care in which order the promises 
            // are resolved.
            toResolve.push(Area.AREA.updateOrderByAreaUUID(area.uuid, order, transaction))
        }
        await Promise.all(toResolve)
    }

    /**
     * Responsible for removing an area from the database. This will remove the area and all the fields that are in this area.
     * 
     * @param {string} uuid - The uuid of the area that you want to remove.
     * @param {import('sequelize').Transaction} transaction - The transaction that will be used to remove the area and all the apps that are in this area.
     */
    async removeArea(uuid, transaction) {
        await Area.AREA.deleteArea(this.workspaceId, uuid, transaction)
        await this.#reorderAreas(transaction)
    }
}

module.exports = AreaService