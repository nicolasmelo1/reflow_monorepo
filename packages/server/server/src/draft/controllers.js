const controllers = require('../../../palmares/controllers')
const status = require('../../../palmares/status')

const { strings } = require('../core/utils')
const { reflowJSONError } = require('../core/services')
const DraftService = require('./services')
const { 
    DraftFileInputSerializer,
    DraftSaveFileOutputSerializer
} = require('./serializers')

const { deepCopy } = require('../../../../shared/utils') 

const fs = require('fs')
const os = require('os') 
const path = require('path')

let lastClearCacheDate = new Date()
let uploadingFiles = {}

/**
 * This will update the memory cache with the file that is being uploaded. Be aware that this service is not stateless at the current time
 * but we want to make it stateless by creating a blob table so we can store all of the chunks.
 */
function updateUploadingFile(fileUUID, fileName, fileSize, filePath) {
    uploadingFiles[fileUUID] = {
        fileName: fileName,
        fileSize: fileSize,
        folder: path.dirname(filePath),
        path: filePath,
        uploadedDate: new Date()
    }
}

/**
 * This will remove the file from the cache so we will not be able to use it anymore from the memory, instead we will just be able
 * to see the file again from the s3.
 */
async function removeUploadingFileCache(fileUUID) {
    const pathToRemove = uploadingFiles[fileUUID].path
    try { fs.unlink(pathToRemove, (error) => {console.log(`${pathToRemove} was deleted after upload.`)}) } catch (e) {}
    delete uploadingFiles[fileUUID]

    /**
     * Suppose the upload failed for some reason, we need to clear all of the hanging objects from the array.
     * That's exactly what we do here. After 24 hours, all of the hanging objects are cleared from the cache and 
     * we can run the application normaly
     */
    const expiryHours = 24
    const now = new Date()
    const maximumCacheCheckDate = new Date(lastClearCacheDate.getTime() + expiryHours * 60 * 60 * 1000)
    if (now > maximumCacheCheckDate) {
        let newUploadingFiles = {}
        for (const key of Object.keys(uploadingFiles)) {
            const maximumCacheDate = new Date(uploadingFiles[key].uploadedDate.getTime() + expiryHours * 60 * 60 * 1000)
            if (now < maximumCacheDate) {
                newUploadingFiles[key] = uploadingFiles[key]
            } else {
                const removingPath = uploadingFiles[key].path
                try { fs.unlink(removingPath, (error) => {console.log(`${removingPath} was deleted from cache.`)}) } catch (e) {}
            }
        }
        uploadingFiles = newUploadingFiles
        lastClearCacheDate = now
    }
}

/**
 * This controller is responsible for saving a file to the draft storage. This file is temporary and will be removed after a certain time.
 */
class DraftSaveFileController extends controllers.Controller {
    inputSerializer = DraftFileInputSerializer
    outputSerializer = DraftSaveFileOutputSerializer
    
    /**
     * Will upload and store the file in the draft storage so when we save the data we can retrieve the data from the storage
     * and just copy to the final storage. This copy will happen MUCH faster than it would be done if it was made directly from the user.
     * Because we use our cloud network to copy files from one place to another.
     * 
     * This will upload using `application/octer-stream`, you can find a reference for the implementation on the following links:
     * Reference: https://www.youtube.com/watch?v=Ix-c2X7dlks (source code: https://github.com/hnasr/javascript_playground/tree/master/simple-uploader)
     * And: https://www.youtube.com/watch?v=dbYBVbrDnwg (source code: https://github.com/dejwid/mern-chunked-upload)
     * 
     * We use more the second reference because React Native does not support `.readAsArrayBuffer()` 
     * (https://github.com/facebook/react-native/blob/c6b96c0df789717d53ec520ad28ba0ae00db6ec2/Libraries/Blob/FileReader.js#L83)
     * 
     * @param {import('express').Request} req - Express's request object.
     * @param {import('express').Response} res - Express's response object.
     * @param {object} transaction - The transaction object recived from the sequelize ORM to use in the controller lifecycle.
     */
    async post(req, res, _, transaction) {
        const inputSerializer = new this.inputSerializer({ data: req.query })
        if (await inputSerializer.isValid()) {
            const { uuid, name, size, currentChunkIndex, totalChunks } = inputSerializer.internalData
            const isLastChunk = parseInt(currentChunkIndex) === parseInt(totalChunks) - 1
            const isFirstChunk = parseInt(currentChunkIndex) === 0

            const osTempDir = os.tmpdir()
            const data = req.body.toString().split(',')
            const filePath = path.join(osTempDir, uuid)

            if (isFirstChunk) updateUploadingFile(uuid, name, size, filePath)

            if (data.length > 1) {
                const buffer = Buffer.from(data[1], 'base64')
                fs.appendFileSync(filePath, buffer)
            }
            if (isLastChunk) {
                const file = deepCopy(uploadingFiles[uuid])
                const draftStringId = await inputSerializer.toSave(req.user.id, req.workspace.id, file, transaction)
                
                removeUploadingFileCache(uuid)
                const outputSerializer = new this.outputSerializer({ instance: { draftStringId: draftStringId }})
                return res.status(status.HTTP_201_CREATED).json({
                    status: 'ok',
                    data: await outputSerializer.toRepresentation()
                })
            } else if (data.length > 1 && isLastChunk === false) {
                return res.status(status.HTTP_206_PARTIAL_CONTENT).json({
                    status: 'ok'
                })
            }

            removeUploadingFileCache(uuid)
            return res.status(status.HTTP_406_NOT_ACCEPTABLE).json({
                status: 'error',
                error: reflowJSONError({
                    reason: 'invalid_file',
                    detail: strings(req.preferredLanguage, 'draftFileNotUploadedError')
                })
            })
        }
        const error = inputSerializer.error()
        return res.status(status.HTTP_400_BAD_REQUEST).json({
            status: 'error',
            error: reflowJSONError({
                reason: error.errorKey ? error.errorKey : error.reason,
                detail: error.detail ? error.detail : error.reason,
                metadata: error.fieldName ? { fieldName: error.fieldName } : {}
            })
        })
    }
}

/**
 * Responsible for working with a specific draft file. This will retrieve the url of the file so we can
 * show a preview for it in the front-end.
 */
class DraftFileUrlController extends controllers.Controller {
    /**
     * This handler will retrive the original url file. By default as you might already know, we save the draft outside of
     * the application in a proper storage system. Right now the storage system used is the s3 and the image is actually private.
     * So what we do is that we generate a temporary url only to display the image on the front-end.
     * 
     * @param {import('express').Request} req - Express's request object.
     * @param {import('express').Response} res - Express's response object.
     */
    async get(req, res) {
        const draftService = new DraftService(req.user.id, req.workspace.id)
        const urlToRedirect = await draftService.retrieveDraftFileUrl(req.params.draftStringId)
        if (typeof urlToRedirect === 'string') {
            return res.redirect(urlToRedirect)
        } else {
            return res.send('')
        }
    }
}

class DraftRemoveController extends controllers.Controller {
    async delete(req, res, _, transaction) {
        const draftService = new DraftService(req.user.id, req.workspace.id)
        await draftService.removeDraft(req.params.draftStringId, transaction)
        return res.status(status.HTTP_200_OK).json({
            status: 'ok'
        })
    }
}

module.exports = {
    DraftSaveFileController,
    DraftFileUrlController,
    DraftRemoveController
}