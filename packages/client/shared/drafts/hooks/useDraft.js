import { useState } from 'react'
import draftAgent from '../agent'

/**
 * Special hook used for working with drafts inside of reflow application. Drafts are temporary files that does not live forever.
 * Instead they live for a limited time inside of the application, and after that time has passed, they are deleted from our storage and
 * from the database.
 * 
 * @returns {{
 *      uploadFile: (worskapceUUID: string, file: File) => Promise<string>
 * }} - Return
 */
function useDraft() {
    const [draftsToTrack, setDraftsToTrack] = useState([])

    /**
     * Function for uploading a file to the draft storage. The draft will leave for a certain time until it's deleted. After the file is uploaded we keep track
     * of the file so when it is deleted we can still keep the reference to it.
     * 
     * @param {string} workspaceUUID - The id of the workspace where the draft will be stored, in other words, this is the company that is storing the draft.
     * @param {File} file - The file that will be uploaded to the draft storage.
     */
    function uploadFile(workspaceUUID, file) {
        return draftAgent.uploadDraftFile(workspaceUUID, file)
    }

    return {
        uploadFile
    }
}

export default useDraft