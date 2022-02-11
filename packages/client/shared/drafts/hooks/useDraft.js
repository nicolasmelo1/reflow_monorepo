import { useEffect, useRef } from 'react'
import { isDraft } from '../../../../shared/draft'
import { isSuccess } from '../../../../shared/utils/httpStatus'
import draftAgent from '../agent'

/**
 * Special hook used for working with drafts inside of reflow application. Drafts are temporary files that does not live forever.
 * Instead they live for a limited time inside of the application, and after that time has passed, they are deleted from our storage and
 * from the database.
 * 
 * @param {string} workspaceUUID - The uuid of the workspace where the user is working on. In other words, this is the company
 * where the user is logged in. We use it to save the draft to the correct workspace.
 * 
 * @returns {{
 *      uploadFile: (file: File) => Promise<string>,
 *      retrieveUrl: (draftUUID: string) => Promise<string>,
 * }} - Return
 */
function useDraft(workspaceUUID) {
    const draftInformationByDraftStringIdRef = useRef({})

    /**
     * Function for uploading a file to the draft storage. The draft will leave for a certain time until it's deleted. After the file is uploaded we keep track
     * of the file so when it is deleted we can still keep the reference to it.
     * 
     * @param {File} file - The file that will be uploaded to the draft storage.
     * 
     * @param {Promise<string>} - Returns a promise that resolves to the draftStringId of the uploaded file.
     */
    async function uploadFile(file) {
        const response = await draftAgent.uploadDraftFile(workspaceUUID, file)
        if (response && isSuccess(response.status)) {
            const draftStringId = response.data.data.draftStringId
            const draftUrl = await draftAgent.retrieveDraftFileUrl(workspaceUUID, draftStringId) 

            draftInformationByDraftStringIdRef.current = {
                ...draftInformationByDraftStringIdRef.current,
                [draftStringId]: {
                    url: draftUrl,
                    fileName: file.name,
                    file: file
                }
            }

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
            const draftInformation = draftInformationByDraftStringIdRef.current[draftStringId]
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
    
    /**
     * Removes a draft from the `draftInformationByDraftStringIdRef` object and from the backend database. It is an async function so it will
     * return a promise with a boolean value.
     * 
     * @param {string} draftStringId - The base64 encoded string that is used to identify the draft, this is the draftStringId that you want to remove
     * from the database.
     * 
     * @returns {Promise<boolean>} - Returns a promise that resolves to true if the draft was removed, false otherwise.
     */
    async function removeDraft(draftStringId) {
        if (isDraft(draftStringId)) {
            const response = await draftAgent.removeDraft(workspaceUUID, draftStringId)
            if (response && isSuccess(response.status)) {
                delete draftInformationByDraftStringIdRef.current[draftStringId]
                return true
            }
        }
        return false
    }

    function isADraft(draftStringId) {
        if (draftInformationByDraftStringIdRef.current[draftStringId] === undefined) return false
        else return isDraft(draftStringId)
    }

    /**
     * This effect will be responsible for removing the drafts from the database when the component unmounts.
     * 
     * This means that when the user leaves the page, or just closes the component after clicking some button
     * we will effectively remove the drafts from the database.
     */
    useEffect(() => {
        return () => {
            for (const draftStringId of Object.keys(draftInformationByDraftStringIdRef.current)) {
                removeDraft(draftStringId)
            }
        }
    }, [])

    return {
        uploadFile,
        retrieveInformation,
        removeDraft,
        isADraft
    }
}

export default useDraft