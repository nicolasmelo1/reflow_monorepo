import useAttachmentField from '../../hooks/useAttachmentField'
import Layout from './layouts'

export default function FormularyFieldAttachment(props) {
    const { 
        containerRef,
        draggingOver,
        webOnToggleDraggingOver,
        onDownloadAttachmentFile,
        onRemoveAttachment,
        onChangeOpenedUUIDValue,
        onUploadAttachment,
        valueUUIdOpened,
        values,
        retrieveFileNameAndUrlByValue
    } = useAttachmentField(props.field, props.onChangeFieldConfiguration, props.registerOnDuplicateOfField)
    
    return (
        <Layout
        containerRef={containerRef}
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
