import { useRef, useState, useEffect, useContext } from 'react'
import { generateUUID } from '../../../../shared/utils'
import { WorkspaceContext } from '../../authentication/contexts'
import { useDraft } from '../../drafts'
import { APP } from '../../conf'


/**
 * This hook is used to handle the logic specific to the `attachment` field type. Instead of handling everything
 * inside of the component we handle here, so we can reuse this logic whenever we need.
 * 
 * @param {{
 *      uuid: string,
 *      labelIsHidden: boolean,
 *      fieldIsHidden: boolean,
 *      fieldTypeId: number,
 *      label: {
 *          name: string
 *      },
 *      isUnique: boolean,
 *      options: Array<{
 *          uuid: string, 
 *          value: string, 
 *          order: number, 
 *          color: string
 *      }>,
 *      attachmentField: {
 *          uuid: string,
 *          maxNumberOfAttachments: number
 *      } | null | undefined,
 *      placeholder: null | string,
 *      required: boolean
 * }} fieldData - The data of the field.
 */
export default function useAttachmentField(fieldData, onChangeField, registerOnDuplicateOfField) {
    const containerRef = useRef()

    const [field, setField] = useState(fieldData)
    const [valueUUIdOpened, setValueUUIdOpened] = useState(null)
    const [draggingOver, setDraggingOver] = useState({
        isDraggingOver: false,
        heightOfContainer: undefined,
    })
    const [isUploading, setIsUploading] = useState(false)
    const [values, setValues] = useState([])
    
    const { state: { selectedWorkspace } } = useContext(WorkspaceContext)
    
    const drafts = useDraft(selectedWorkspace.uuid)

    /**
     * This will create a new attachment field data, this is the data needed in order to configure the `attachment` field type.
     * With this data we are able to work with the `attachment` field type.
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

    /**
     * / * WEB ONLY * /
     * 
     * This will work on web only, when the user drags a file over the attachment field we will display a message so he can drop the file.
     * Generally this is activated by the `onDragEnter` event and deactivated on the `onDragLeave` event.
     * 
     * @param {boolean} [isDraggingOver=!isDraggingOver] - The state of the dragging over. The default value is the opposite of the current state.
     * @param {number} [heightOfContainer=undefined] - The height of the container, so when we drag the height of the container stays the same.
     */
    function webOnToggleDraggingOver(isDraggingFileOver=!draggingOver.isDraggingOver, defaultHeightOfElement=undefined) {
        setDraggingOver({
            isDraggingOver: isDraggingFileOver,
            heightOfContainer: defaultHeightOfElement
        })
    }

    /**
     * This is responsible for the `onChange` event when the user adds or removes a file from the element.
     * 
     * @param {Array<{uuid: string, value: string}>} values - The values that are being added inside of the element.
     * This is called whenever the user clicks to remove a file or is adding a new file.
     */
    function onChangeAttachments(values) {
        setValues(values)
    }

    /**
     * Function used for uploading the file to the draft storage in the backend/database. If you want to understand
     * how we upload data to the backend you can check the `uploadFile` function in the `useDraft` hook.
     * There is no limit for the size of the file that can be uploaded.
     * 
     * @param {Array<File>} files - The files that will be uploaded to the draft storage.
     */
    function onUploadAttachment(files) {
        setIsUploading(true)
        if (files.length > 0) {
            const promisesToResolve = []
            for (let i=0; i < files.length; i++) {
                const file = files[i]
                promisesToResolve.push(drafts.uploadFile(file))
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
                onChangeAttachments(values.concat(...newValues))
                setIsUploading(false)
            }).catch(_ => {
                setIsUploading(false)
            })
        } else {
            setIsUploading(false)
        }
    }
    
    /**
     * Function that will be used for removing the attachment from the formulary. We only effectively remove the attachment when we click `save`
     * after we finish editing the formulary. Otherwise the attachment will appear as removed but will be kept as is.
     * After we remove the attachment, the detail view will move from the previous value in the list, otherwise we will go to the next one. If there are
     * no values left, we will close the detail view.
     * 
     * @param {string} uuid - The uuid of the value that is being removed (not the draft, this is for drafts and values that were saved)
     */
    function onRemoveAttachment(uuid) {
        function removeValueAndMoveToNextDetailAttachment(indexToRemove, newOpenedUUID) {
            values.splice(indexToRemove, 1)
            onChangeAttachments(values)
            onChangeOpenedUUIDValue(newOpenedUUID)
        }

        const indexToRemove = values.findIndex(value => value.uuid === uuid)
        if (indexToRemove !== -1) {
            let newOpenedUUID = null
            if (indexToRemove > 0 && values.length > 1) {
                newOpenedUUID = values[indexToRemove - 1].uuid
            } else if (values.length > 1) {
                newOpenedUUID = values[indexToRemove + 1].uuid
            }
            if (drafts.isADraft(values[indexToRemove].value)) {
                drafts.removeDraft(values[indexToRemove].value).then(hasRemovedDraft => {
                    if (hasRemovedDraft === true) {
                        removeValueAndMoveToNextDetailAttachment(indexToRemove, newOpenedUUID)
                    }
                })
            } else {
                removeValueAndMoveToNextDetailAttachment(indexToRemove, newOpenedUUID)
            }
        }
    }

    /**
     * Function used for changing the opened attachment. When the user clicks the attachment we will open it in detail so
     * he can fully see the contents of the attachment. The image in the field is too small for him to be able to see. So what we do
     * is that we open the attachment detail for him.
     * 
     * @param {string | null} valueUUID - The uuid of the attachment that will be opened. If you send null, then no attachment will be opened and we will
     * close the detail view.
     */
    function onChangeOpenedUUIDValue(valueUUID) {
        setValueUUIdOpened(valueUUID)
    }

    /**
     * This will effectively download the file in the user's computer/device. First we check what this value is, is it a draft or an actually saved value? 
     * If it is not a draft, then we will download the file from the attachment storage so we need to retrieve from the attachment url. Otherwise we will download
     * from the draft storage.
     * 
     * @param {string} valueUUID - The uuid of the attachment value that will be downloaded.
     */
    function onDownloadAttachmentFile(valueUUID) {
        const indexToDownload = values.findIndex(value => value.uuid === valueUUID)
        if (indexToDownload !== -1) {
            const value = values[indexToDownload]
            if (drafts.isADraft(value.value)) {
                const draftInformation = drafts.retrieveInformation(value.value)
                if (draftInformation.file !== null) {
                    if (APP === 'web') {
                        window.open(draftInformation.url, '_blank')
                    }
                }
            } else {
                // Add logic to download the file when the file is not a draft
            }
        }
    }

    /**
     * Retrieves the fileName and the url of an attachment. First we need to check if it is a draft or not. If it is a draft, then we will need to retrieve the fileName    
     * and the url from the draft storage. Otherwise we will need to retrieve the fileName and the url from the attachment storage. If it is not a draft the value
     * saved will be the name of the file.
     * 
     * @param {string} valueUUID - The uuid of the attachment value that will be downloaded.
     * 
     * @returns {{ fileName: string, url: string }} - The fileName and the url to download the attachment.
     */
    function retrieveFileNameAndUrlByValue(valueUUID, valueOrDraftStringId) {
        const isDraft = drafts.isADraft(valueOrDraftStringId)
        if (isDraft === true) {
            const draftInformation = drafts.retrieveInformation(valueOrDraftStringId)
            return {
                fileName: draftInformation.fileName,
                url: draftInformation.url
            }
        } else {
            const value = values.find(value => value.uuid === valueUUID)
            if (value !== undefined) {
                return {
                    fileName: value.value,
                    url: ''
                }
            }
        }

        return {
            fileName: '',
            url: ''
        }
    }

    /**
     * Function used for when the user duplicates the attachment field. When this happens what we do is just change the uuid of the `attachmentField` options 
     * for the attachment field.
     * 
     * @param {object} newField - The new field that will be duplicated.
     */
    function onDuplicateField(newField) {
        newField.attachmentField.uuid = generateUUID()
    }

    /**
     * If the field is not an attachment, or at least it has just been changed to an attachment, then we need to create the
     * attachment field data. This data will be used to configure the `attachment` field type with custom data.
     */
    function onDefaultCreateAttachmentOptionsIfDoesNotExist() {
        const doesFieldAttachmentDataExists = typeof field.attachmentField === 'object' && ![null, undefined].includes(field.attachmentField)
        if (doesFieldAttachmentDataExists === false) {
            field.attachmentField = createAttachmentFieldData()
            setField(field)
            onChangeField(field)
        }
    }

    /**
     * ON first render what we do is check if the `attachmentField` exist in the field. If it does not exist, then we will create it.
     * Then we will register the function to be called when the field is duplicated.
     */
    useEffect(() => {
        onDefaultCreateAttachmentOptionsIfDoesNotExist()
        registerOnDuplicateOfField(field.uuid, onDuplicateField)
    }, [])

    /**
     * When the external field changes we should also change the internal field value.
     */
     useEffect(() => {
        const isFieldDifferentFromStateField = typeof fieldData !== typeof field && JSON.stringify(fieldData) !== JSON.stringify(field)
        if (isFieldDifferentFromStateField) {
            setField(fieldData)
        }
    }, [fieldData])
    
    return {
        containerRef,
        isUploading,
        draggingOver,
        webOnToggleDraggingOver,
        onDownloadAttachmentFile,
        onRemoveAttachment,
        onChangeOpenedUUIDValue,
        onUploadAttachment,
        valueUUIdOpened,
        values,
        retrieveFileNameAndUrlByValue
    }
}