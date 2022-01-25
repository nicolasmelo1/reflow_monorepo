const { models } = require('../../../../palmares/database')

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
     * This will retrive all of the areas (and subAreas) of a particular workspace.
     * 
     * @param {number} workspaceId - The id of the workspace that we are trying to retrieve the areas for.
     * 
     * @returns {Promise<Array<Area>>} - All of the areas (and subAreas) of the workspace.
     */
    async areasByWorkspaceId(workspaceId) {
        return await this.getInstance().findAll({
            where: {
                workspaceId: workspaceId
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

    /**
     * THis is similar to `idByUUID` except that this will retrieve the uuid based on a given id.
     * 
     * @param {number} id - The id of the area that we are trying to retrieve the uuid for.
     * 
     * @returns {Promise<string>} - The uuid of the area.
     */
    async uuidById(id) {
        const result = await this.getInstance().findOne({
            attributes: ['uuid'],
            where: {
                id: id
            }
        })
        return result !== null ? result.uuid : null
    }
    /**
     * Checks if a given area exists by a given uuid.
     * 
     * @param {string} uuid - The uuid of the area that we are trying to check if it exists.
     * 
     * @returns {Promise<boolean>} - Whether or not the area exists.
     */
    async existsByUUID(uuid) {
        return (await this.getInstance().count({
            where: {
                uuid: uuid
            }
        })) > 0
    }

    /**
     * Checks if, for a specific workspaceId. A given labelName exists. If we are editing an area instance we will
     * not consider this area instance on the check.
     * 
     * This will guarante the labelName is unique for the given workspace and it will be a LOT easier to manage.
     * 
     * @param {number} workspaceId - The id of the workspace that we are creating or updating the area for
     * @param {string} labelName - The label name to guarantee if it is unique.
     * @param {string | null} uuid - If you are editing an area, please set this uuid so we ignore it on the check.
     * 
     * @returns {Promise<boolean>} - Returns a promise that resolves to either true or false depending if it exists
     * or not.
     */
    async existsByWorkspaceIdAndLabelNameIgnoringUUIDIfDefined(workspaceId, labelName, uuid=null) {
        const { operations } = this.getEngineInstance()
        let query = {
            where: {
                workspaceId: workspaceId,
                labelName: labelName
            }
        }
        if (![null, undefined].includes(uuid)) {
            query.where = {
                ...query.where,
                uuid: {
                    [operations.not]: uuid
                }
            }
        }
        return (await this.getInstance().count(query)) > 0
    }

    /**
     * Checks if a given areaName exists for a given workspaceId and ignoring a specific uuid if exists.
     * We use this to create a new name for the area. A name is like an id but it's url and user friendly.
     * We remove all of the accents, spaces, and so on. So the user can add this name to urls. API's and so on.
     * It gives a more easy way for interacting with the data.
     * 
     * @param {number} workspaceId - The id of the workspace that we are trying to see if the areaName exists.
     * @param {string} areaName - The name of the area that we are trying to see if it exists.
     * @param {string | null} uuid - If you are editing an area, please set this uuid so we ignore it on the check.
     * 
     * @returns {Promise<boolean>} - Returns a promise that resolves to either true or false depending if it exists
     * or not.
     */
    async existsByWorkspaceIdAndAreaNameExcludingAreaUUIDIfExists(workspaceId, areaName, uuid=null) {
        const { operations } = this.getEngineInstance()
        const query = {
            where: {
                workspaceId: workspaceId,
                name: areaName
            }
        }

        if (uuid !== null) {
            query.where.uuid = {
                [operations.ne]: uuid
            }
        }
        return (await this.getInstance().count(query)) > 0
    }

    /**
     * This will update only the order of the area to a new number so we can maintain all of the areas of a workspace always in order.
     * 
     * @param {string} uuid - The uuid of the area that we are trying to update the order for.
     * @param {number} order - The new order that we are trying to set for the area.
     * @param {import('sequelize').Transaction} transaction - The transaction that will be used to save the data in the database so if any error happens we can rollback
     * the changes.
     * 
     * @returns {Promise<number>} - Returns a promise that resolves to the number of areas updated. Usually just one.
     */
    async updateOrderByAreaUUID(uuid, order, transaction) {
        return await this.getInstance().update({
            order: order,
        }, {
            where: {
                uuid: uuid
            },
            transaction: transaction
        })
    }

    /**
     * This will update everything about a particular area. From the color, to the labelName, the name and so on.
     * 
     * @param {object} area - The area that we are trying to update.
     * @param {string} area.uuid - The uuid of the area that we are trying to update.
     * @param {string} area.labelName - The labelName of the area that we are trying to update.
     * @param {string} area.name - The name of the area that we are trying to update. This is like a url friendly string.
     * @param {string} area.color - The color of the area that we are trying to update. The color is the background color of the area that we show on the front-end.
     * @param {number} area.order - The ordering of the area, is it first, is it second, is it the last area?
     * @param {number} area.workspaceId - The id of the workspace that we are trying to update the area for.
     * @param {number | null} [area.subAreaOfId=null] - The id of the area that is parent of this area, with this we can compose one area inside another and so on.
     * @param {import('sequelize').Transaction} transaction - The transaction that will be used to save the data in the database so if any error happens 
     * we can rollback the changes.
     * 
     * @returns {Promise<number>} - Returns a promise that resolves to the number of areas updated. Usually just one.
     */
    async updateArea({ uuid, labelName, name, description, color, order, workspaceId, subAreaOfId=null } = {}, transaction) {
        return await this.getInstance().update({
            labelName: labelName,
            name: name,
            description: description,
            color: color,
            order: order,
            subAreaOfId: subAreaOfId,
            workspaceId: workspaceId
        }, {
            where: {
                uuid: uuid
            },
            transaction: transaction,
        })
    }

    /**
     * This will create a new area from scratch.
     * 
     * @param {object} area - The area that we are trying to update.
     * @param {string} area.uuid - The uuid of the area that we are trying to update.
     * @param {string} area.labelName - The labelName of the area that we are trying to update.
     * @param {string} area.name - The name of the area that we are trying to update. This is like a url friendly string.
     * @param {string} area.color - The color of the area that we are trying to update. The color is the background color of the area that we show on the front-end.
     * @param {number} area.order - The ordering of the area, is it first, is it second, is it the last area?
     * @param {number} area.workspaceId - The id of the workspace that we are trying to update the area for.
     * @param {number | null} [area.subAreaOfId=null] - The id of the area that is parent of this area, with this we can compose one area inside another and so on.
     * @param {import('sequelize').Transaction} transaction - The transaction that will be used to save the data in the database so if any error happens 
     * we can rollback the changes.
     * 
     * @returns {Promise<import('../models').Area>} - Returns a promise that resolves to the new area that was created.
     */
    async createArea({ uuid, labelName, name, description, color, order, workspaceId, subAreaOfId=null } = {}, transaction) {
        return await this.getInstance().create({
            uuid: uuid,
            labelName: labelName,
            name: name,
            description: description,
            color: color,
            order: order,
            subAreaOfId: subAreaOfId,
            workspaceId: workspaceId
        }, {
            transaction: transaction
        })  
    }

    /**
     * Query for removing an area from the database at a given workspace.
     * 
     * @param {number} workspaceId - The id of the workspace that we are trying to remove the area from.
     * @param {string} uuid - The uuid of the area that we are trying to remove.
     * @param {import('sequelize').Transaction} transaction - The transaction that will be used to save the data in the database so if any error happens
     * we can rollback the changes.
     * 
     * @returns {Promise<number>} - Returns a promise that resolves to the number of areas removed. Usually just one.
     */
    async deleteArea(workspaceId, uuid, transaction) {
        return await this.getInstance().destroy({
            where: {
                workspaceId: workspaceId,
                uuid: uuid
            },
            transaction: transaction
        })
    }
}

module.exports = AreaAreaManager