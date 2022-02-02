import { requests } from '../core/agent'
import { base64 } from '../../../shared/utils'

/**
 * Agent function for uploading drafts. As said before, drafts are temporary files or values that lives for a certain time in our database
 * and later are erased.
 * 
 * Since this function is for uploading files we first need to convert the file name to base64, so we don't lose any information of the file name.
 * while transacting the information.
 * 
 * @param {string} workspaceUUID - The id of the workspace where the draft will be stored, in other words, this is the company that is storing the draft.
 * @param {File} file - The file that will be uploaded to the draft storage.
 * 
 * @returns {Promise<import('axios').Response>} - Returns an axios response so you can get the data of the uploaded file.
 */
function uploadDraftFile(workspaceUUID, file) {
    const formData = new FormData()
    formData.append(base64.encode(file.name), file)

    return requests.post(`/draft/${workspaceUUID}/file`, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        body: formData
    })
}

export default {
    uploadDraftFile
}