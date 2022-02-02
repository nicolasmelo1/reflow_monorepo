const { settings } = require('../../../../palmares/conf')

const { DraftType, Draft } = require('../models')
const { Bucket } = require('../../core/utils')

const fs = require('fs')

/**
 * 
 */
class DraftService {
    constructor(userId, workspaceId) {
        this.userId = userId
        this.workspaceId = workspaceId
        this.bucket = new Bucket()
    }
    
    /**
     * Retrieve the draft bucket key to save the draft on or the bucket key that a given draft was saved.
     * 
     * @param {number} draftInstanceUUID - The draft instance uuid that we want to retrieve the bucket key for.
     * @param {string} fileName - The name of the file that we want to save or was saved.
     * 
     * @returns {Promise<string>} - Returns a promise that resolves to the bucket key.
     */
    async #retrieveDraftBucketKey(draftInstanceUUID, fileName) {
        return `${settings.S3_FILE_DRAFT_PATH}/${draftInstanceUUID}/${fileName}`
    }


    async saveDraft({draftFile=undefined, draftValue=undefined, isPublicDraft=false, uuid=null}={}, transaction) {
        const isDraftFileDefined = ![null, undefined].includes(draftFile)
        const fileSize = isDraftFileDefined ? draftFile.size : null
        draftValue = isDraftFileDefined ? draftFile.fileName : draftValue

        const draftTypeId = [null, undefined].includes(draftFile) ? 
            await DraftType.DRAFT.valueDraftTypeId() :
            await DraftType.DRAFT.fileDraftTypeId()

        const draftInstance = await Draft.DRAFT.createOrUpdateDraft({
            userId: this.userId, workspaceId: this.workspaceId, value: draftValue,
            draftTypeId, fileSize, isPublic: isPublicDraft, uuid: uuid
        }, transaction)

        if (isDraftFileDefined) {
            const file = fs.readFileSync(draftFile.path)
            const bucketKeyToUpload = await this.#retrieveDraftBucketKey(draftInstance.uuid, draftValue)

            const url = await this.bucket.upload(file, bucketKeyToUpload)
            await Draft.DRAFT.updateFileUrlByDraftUUID(draftInstance.uuid, url, transaction)
        }
    }
}

module.exports = DraftService