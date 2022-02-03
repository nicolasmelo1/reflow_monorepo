import { requests, getUrl, getToken } from '../core/agent'
import { generateUUID, httpStatus } from '../../../shared/utils'

/**
 * Agent function for uploading drafts. As said before, drafts are temporary files or values that lives for a certain time in our database
 * and later are erased.
 * 
 * Since this function is for uploading files we first need to convert the file name to base64, so we don't lose any information of the file name.
 * while transacting the information.
 * 
 * We upload in a stream fashion, so we can bypass the default behaviour of nginx that limits the size of the file we can upload. By doing this we are
 * able to upload bigger files.
 * 
 * Reference: https://www.youtube.com/watch?v=Ix-c2X7dlks (source code: https://github.com/hnasr/javascript_playground/tree/master/simple-uploader)
 * And: https://www.youtube.com/watch?v=dbYBVbrDnwg (source code: https://github.com/dejwid/mern-chunked-upload)
 * 
 * We use more the second reference because React Native does not support `.readAsArrayBuffer()` 
 * (https://github.com/facebook/react-native/blob/c6b96c0df789717d53ec520ad28ba0ae00db6ec2/Libraries/Blob/FileReader.js#L83)
 * 
 * @param {string} workspaceUUID - The id of the workspace where the draft will be stored, in other words, this is the company that is storing the draft.
 * @param {File} file - The file that will be uploaded to the draft storage.
 * 
 * @returns {Promise<import('axios').Response>} - Returns an axios response so you can get the data of the uploaded file.
 */
async function uploadDraftFile(workspaceUUID, file) {
    return new Promise(function (resolve, reject) {
        const fileSize = file.size
        const fileName = file.name
        const CHUNK_SIZE = 1024 * 10
        const TOTAL_CHUNKS = Math.ceil(fileSize/CHUNK_SIZE)

        function batchUpload(fileUUID, currentChunkIndex=0) {
            const fileReader = new FileReader()
            
            const isLastChunk = currentChunkIndex === TOTAL_CHUNKS - 1
            const from = currentChunkIndex * CHUNK_SIZE
            const to = from + CHUNK_SIZE
            const blobFile = file.slice(from, to)
    
            fileReader.onload = (e) => {
                const dataToUpload = e.target.result
                requests.post(`/draft/${workspaceUUID}/file`, {
                    headers: {
                        'Content-Type': 'application/octet-stream',
                    },
                    params: {
                        name: fileName,
                        size: fileSize,
                        uuid: fileUUID,
                        current_chunk_index: currentChunkIndex,
                        total_chunks: TOTAL_CHUNKS
                    },
                    body: dataToUpload
                }).then(response => {
                    if (response && httpStatus.isSuccess(response.status)) {
                        if (isLastChunk) resolve(response)
                        else batchUpload(fileUUID, currentChunkIndex + 1)
                    } else {
                        resolve(response)
                    }
                }).catch(error => reject(error))
            }   
            fileReader.readAsDataURL(blobFile)     
        }
        batchUpload(generateUUID())
    })
}

/**
 * This is defined here but it does not call axios directly, what we do instead is that we return the url 
 * to get the draft file. This url will redirect the user for the original url where he is able to retrieve the content
 * that he wants.
 * 
 * @param {string} workspaceUUID - The id of the workspace where the draft will be stored, in other words, this is the company that stored the draft.
 * @param {string} draftStringId - A base64 encoded string that represents the draft uuid. This is the uuid of the draft that
 * was uploaded.
 * 
 * @returns {Promise<string>} - Returns the url to get the draft file.
 */
async function retrieveDraftFileUrl(workspaceUUID, draftStringId) {
    const token = await getToken()
    return getUrl(`/draft/${workspaceUUID}/file/url/${draftStringId}?token=${token}`)
}

export default {
    uploadDraftFile,
    retrieveDraftFileUrl
}