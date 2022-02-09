import { useEffect, useState } from 'react'
import { useDraft } from '../../../drafts'
import { generateUUID } from '../../../../../shared/utils'
import Layout from './layouts'

export default function FormularyFieldAttachment(props) {
    const [isDraggingOver, setIsDraggingOver] = useState(false)
    const [values, setValues] = useState([])
    const drafts = useDraft()

    /**
     * This will create a new attachment field data, this is the data needed in order to configure the `attachment` field type.
     * With this data we are able to work.
     * 
     * @param {object} attachmentFieldData - The params for the attachment field type.
     * @param {string} [attachmentFieldData.maxNumberOfAttachments=null] - The maximum number of attachment a user can add, if null,
     * then the user can add whatever number of attachments he wants.
     */
    function createAttachmentFieldData({
        maxNumberOfAttachments=null
    }={}) {
        return {
            uuid: generateUUID(),
            maxNumberOfAttachments
        }
    }

    function webOnToggleDraggingOver(isDraggingOver=!isDraggingOver) {
        setIsDraggingOver(isDraggingOver)
    }

    /**
     * Function used for uploading the file to the draft storage in the backend/database. If you want to understand
     * how we upload data to the backend you can check the `uploadFile` function in the `useDraft` hook.
     * There is no limit for the size of the file that can be uploaded.
     * 
     * @param {Array<File>} files - The file that will be uploaded to the draft storage.
     */
    function onUploadAttachment(files) {
        if (files.length > 0) {
            const promisesToResolve = []
            for (let i=0; i < files.length; i++) {
                const file = files[i]
                promisesToResolve.push(drafts.uploadFile(props.workspace.uuid, file))
            }

            Promise.all(promisesToResolve).then(uploadedDraftStringIds => {
                let newValues = []
                for (const draftStringId of uploadedDraftStringIds) {
                    if (draftStringId !== null) {
                        newValues.push({
                            uuid: generateUUID(),
                            value: draftStringId
                        })
                    }
                }
                setValues(values.concat(...newValues))
            })
        }
    }
    
    /**
     * If the field is not an attachment, or at least it has just been changed to an attachment, then we need to create the
     * attachment field data. This data will be used to configure the `attachment` field type with custom data.
     */
    function onDefaultCreateAttachmentOptionsIfDoesNotExist() {
        if (props.field.attachmentField === null) {
            props.field.attachmentField = createAttachmentFieldData()
            props.onUpdateFormulary()
        }
    }

    useEffect(() => {
        onDefaultCreateAttachmentOptionsIfDoesNotExist()
    }, [])

    return (
        <Layout
        isDraggingOver={isDraggingOver}
        webOnToggleDraggingOver={webOnToggleDraggingOver}
        onUploadAttachment={onUploadAttachment}
        values={values}
        drafts={drafts}
        workspace={props.workspace}
        types={props.types}
        field={props.field}
        />
    )
}
