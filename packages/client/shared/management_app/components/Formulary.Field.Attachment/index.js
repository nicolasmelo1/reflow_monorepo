import { useEffect, useState } from 'react'
import { useDraft } from '../../../drafts'
import { generateUUID, httpStatus } from '../../../../../shared/utils'
import Layouts from './layouts'

export default function FormularyFieldAttachment(props) {
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

    function onUploadAttachment(file) {
        drafts.uploadFile(props.workspace.uuid, file).then(response => {
            if (response && httpStatus.isSuccess(response.status)) {
                const draftStringId = response.data.data.draftStringId
                setValues([...values, draftStringId])
            }
        })
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

    return process.env['APP'] === 'web' ? (
        <Layouts.Web
        onUploadAttachment={onUploadAttachment}
        values={values}
        types={props.types}
        field={props.field}
        />
    ) : (
        <Layouts.Mobile/>
    )
}
