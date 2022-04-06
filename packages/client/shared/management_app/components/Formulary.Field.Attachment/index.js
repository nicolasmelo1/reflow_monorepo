import useAttachmentField from '../../hooks/useAttachmentField'
import Layout from './layouts'

export default function FormularyFieldAttachment(props) {
    const { 
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
    } = useAttachmentField(props.field, props.onChangeField, props.registerOnDuplicateOfField)
    
    return (
        <Layout
        containerRef={containerRef}
        isUploading={isUploading}
        draggingOver={draggingOver}
        webOnToggleDraggingOver={webOnToggleDraggingOver}
        onDownloadAttachmentFile={onDownloadAttachmentFile}
        onRemoveAttachment={onRemoveAttachment}
        onChangeOpenedUUIDValue={onChangeOpenedUUIDValue}
        onUploadAttachment={onUploadAttachment}
        valueUUIdOpened={valueUUIdOpened}
        values={values}
        retrieveFileNameAndUrlByValue={retrieveFileNameAndUrlByValue}
        field={props.field}
        />
    )
}
