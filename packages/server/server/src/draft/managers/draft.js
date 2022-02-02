const { models } = require('../../../../palmares/database') 

const { generateUUID } = require('../../../../../shared/utils')


class DraftDraftManager extends models.Manager {
    /**
     * Creates or updates a new draft instance in the database. Remember that drafts are temporary files in our system. 
     * Also remember that draft is not obligatorily a file but can also be a value stored temporarily.
     * 
     * @param {object} draftData - The data of the draft to be created.
     * @param {number} draftData.userId - The user who is creating or updating the draft.
     * @param {number} draftData.workspaceId - For which workspace the draft was created.
     * @param {string} draftData.value - The value of the draft, for files this will be the fileName, for values this will be a normal string. 
     * (can be a JSON stringfied for example)
     * @param {number} draftData.draftTypeId - The type of the draft. A file or a value.
     * @param {number | null} [draftData.fileSize=null] - The size of the value if it is a file.
     * @param {boolean} [draftData.isPublic=false] - Is the draft public (this means that is being uploaded by someone unlogged in reflow) or not?
     * @param {string | null} [draftData.uuid=null] - The uuid of the draft to update. If null then we will create the draft.
     * @param {import('sequelize').Transaction} transaction - The transaction to be used when creating the value.
     * 
     * @returns {Promise<import('../models').Draft>} - The created or the updated draft.
     */
    async createOrUpdateDraft({ 
        userId, workspaceId, value, draftTypeId, fileSize=null,
        isPublic=false, uuid=null 
    }={}, transaction) {
        if (uuid === null) {
            return await this.getInstance().create({
                uuid: generateUUID(),
                userId: userId,
                workspaceId: workspaceId,
                value: value,
                draftTypeId: draftTypeId,
                fileSize: fileSize,
                isPublic: isPublic
            }, { transaction })
        } else {
            await this.getInstance().update({
                uuid: uuid,
                userId: userId,
                workspaceId: workspaceId,
                value: value,
                draftTypeId: draftTypeId,
                fileSize: fileSize,
                isPublic: isPublic
            }, {
                where: {
                    uuid: uuid
                },
                transaction: transaction
            })
            
            return await this.getInstance().findOne({
                where: {
                    uuid: uuid
                }
            })
        }
    }

    /**
     * Updates the fileUrl of a draftUUID. We need the uuid to save the url but we cannot
     * send the uuid on the `createOrUpdateDraft` function otherwise it will update the 
     * draft.
     * 
     * @param {string} draftUUID - The uuid of the draft to update.
     * @param {string} fileUrl - The url to update on the draft.
     * @param {import('sequelize').Transaction} transaction - The transaction to be used when creating the value.
     * 
     * @param {Promise<number>} - The number of updated draft instances, usually this will be 1.
     */
    async updateFileUrlByDraftUUID(draftUUID, fileUrl, transaction) {
        return await this.getInstance().update({
            fileUrl: fileUrl
        }, { 
            where: {
                uuid: draftUUID
            },
            transaction: transaction
        })
    }
}

module.exports = DraftDraftManager