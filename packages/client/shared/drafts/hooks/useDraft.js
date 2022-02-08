import { useState } from 'react'
import { isDraft } from '../../../../shared/draft'
import { isSuccess } from '../../../../shared/utils/httpStatus'
import draftAgent from '../agent'

/**
 * Special hook used for working with drafts inside of reflow application. Drafts are temporary files that does not live forever.
 * Instead they live for a limited time inside of the application, and after that time has passed, they are deleted from our storage and
 * from the database.
 * 
 * @returns {{
 *      uploadFile: (worskapceUUID: string, file: File) => Promise<string>,
 *      retrieveUrl: (draftUUID: string) => Promise<string>,
 * }} - Return
 */
function useDraft() {
    const [draftInformationByDraftStringId, setDraftInformationByDraftStringId] = useState({})
    /**
     * Function for uploading a file to the draft storage. The draft will leave for a certain time until it's deleted. After the file is uploaded we keep track
     * of the file so when it is deleted we can still keep the reference to it.
     * 
     * @param {string} workspaceUUID - The id of the workspace where the draft will be stored, in other words, this is the company that is storing the draft.
     * @param {File} file - The file that will be uploaded to the draft storage.
     * 
     * @param {Promise<string>} - Returns a promise that resolves to the draftStringId of the uploaded file.
     */
    async function uploadFile(workspaceUUID, file) {
        const response = await draftAgent.uploadDraftFile(workspaceUUID, file)
        if (response && isSuccess(response.status)) {
            const draftStringId = response.data.data.draftStringId
            const draftUrl = await draftAgent.retrieveDraftFileUrl(workspaceUUID, draftStringId) 

            setDraftInformationByDraftStringId({
                ...draftInformationByDraftStringId,
                [draftStringId]: {
                    url: draftUrl,
                    fileName: file.name,
                    file: file
                }
            })

            return draftStringId
        }
        return null
    }

    /**
     * Retrieves the information of the draft file that was uploaded in the backend, it will retrieve the fileName,
     * the url and the file.
     * 
     * @param {string} draftStringId - The base64 encoded string that is used to identify the draft,
     * 
     * @returns {{url: string, fileName: string, file: File}} - Return an object with the draft information.
     */
    function retrieveInformation(draftStringId) {
        if (isDraft(draftStringId)) {
            const draftInformation = draftInformationByDraftStringId[draftStringId]
            if (draftInformation !== undefined) {
                return draftInformation
            }
        } 
        
        return {
            url: '',
            fileName: '',
            file: null
        }
    }
    


    return {
        uploadFile,
        retrieveInformation
    }
}

export default useDraft