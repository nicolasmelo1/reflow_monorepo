const { settings } = require('../../../../palmares/conf')

const { DraftType, Draft } = require('../models')
const { Bucket } = require('../../core/utils')

const { base64 } = require('../../../../../shared/utils')
const { DRAFT_STRING_TEMPLATE, isDraft } = require('../../../../../shared/draft')

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
     * Converts a draft instance id to a draftStringId. The draft string id is just the
     * draftUUID url encoded in a string like `draft_${draftUUID}` where {draftUUID} is a string
     * so for example if draftUUID is `50a28a0c-e69f-4261-a6c9-4abc2801b398` the draftStringId would be 
     * 'draft_50a28a0c-e69f-4261-a6c9-4abc2801b398'
     * 
     * Then, this string is base64 encoded so the end user don't know what it means.
     * 
     * @param {string} draftUUID - A Draft instance uuid to convert to a draftStringId
     * 
     * @returns {Promise<string>} - Returns a base64 enconded string.
     */
    static async draftUUIDToDraftStringId(draftUUID) {
        return base64.encode(DRAFT_STRING_TEMPLATE.replace('{}', draftUUID))
    }

    /**
     * This will return from a base64 enconded draftStringId the uuid of the draft instance.
     * 
     * @param {string} draftStringId - This is a `draftStringId`, the draft string id is generated by the uuid of an draft instance. You can read
     * the functions `saveDraft` and `draftUUIDToDraftStringId` for more informations.
     * 
     * @returns {Promise<string | null>} - Returns a promise that evaluates to a draft instance uuid or to null if the string is not a draft.
     */
    static async fromDraftStringIdToDraftUUID(draftStringId) {
        if (isDraft(draftStringId)) {
            const partOfStringToTakeOut = DRAFT_STRING_TEMPLATE.replace('{}', '')
            return base64.decode(draftStringId).replace(partOfStringToTakeOut, '')
        } else {
            return null
        }
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

    async retrieveDraftFileUrl(draftStringId) {
        const draftUUID = await DraftService.fromDraftStringIdToDraftUUID(draftStringId)
        if (draftUUID === null) return null
        
        const draftFileName = await Draft.DRAFT.draftValueByUUID(draftUUID)
        if (draftFileName === null) return null
        
        const bucketKey = await this.#retrieveDraftBucketKey(draftUUID, draftFileName)
        return await this.bucket.getUrlFromKey(bucketKey)
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

        return await DraftService.draftUUIDToDraftStringId(draftInstance.uuid)
    }
}

module.exports = DraftService