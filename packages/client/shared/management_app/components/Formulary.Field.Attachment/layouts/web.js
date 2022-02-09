import { Tooltip, strings } from '../../../../core'
import {
    faFileUpload,
    faPlusSquare
} from '@fortawesome/free-solid-svg-icons'
import Styled from '../styles'

export default function FormularyFieldAttachmentWebLayout(props) {
    const hasValuesDefined = props.values.length !== 0

    return (
        <Styled.Container
        isDraggingOver={props.isDraggingOver}
        onDragOver={(e) => {
            e.preventDefault()
            e.stopPropagation()
        }}
        onDragLeave={(e) => {
            e.preventDefault()
            e.stopPropagation()
            if (props.isDraggingOver === true) {
                props.webOnToggleDraggingOver(false)
            }
        }}
        onDragEnter={(e) => {
            e.preventDefault()
            e.stopPropagation()
            if (props.isDraggingOver === false && e?.dataTransfer?.items && e.dataTransfer.items.length > 0) {
                props.webOnToggleDraggingOver(true)
            }
        }}
        onDrop={(e) => {
            e.preventDefault()
            e.stopPropagation()
            props.webOnToggleDraggingOver(false)
            if (e?.dataTransfer?.files && e.dataTransfer.files.length > 0) {
                props.onUploadAttachment(e.dataTransfer.files)
            }
        }}
        >
            {props.isDraggingOver === true ? (
                <Styled.DragAndDropMessage>
                    {strings('formularyFieldAttachmentDragAndDropFileMessage')}
                </Styled.DragAndDropMessage>
            ) : hasValuesDefined === true ? (
                <Styled.ContainerWrapper>
                    {props.values.map(value => {
                        const draftInformation = props.drafts.retrieveInformation(value.value)
                        return (
                            <Tooltip
                            key={value.uuid}
                            placement={['bottom', 'top']}
                            text={draftInformation.fileName}
                            >
                                <Styled.FileContainer>
                                    <Styled.ImageWrapper>
                                        <img
                                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                                        src={draftInformation.url}
                                        />
                                    </Styled.ImageWrapper>
                                </Styled.FileContainer>
                            </Tooltip>
                        )
                    })}
                    <Tooltip
                    text={typeof(props.field.placeholder) === 'string' ? props.field.placeholder : strings('formularyFieldAttachmentPlaceholder')}
                    >
                        <Styled.AddNewFileButton>
                            <Styled.AddNewFileButtonIcon 
                            icon={faPlusSquare}
                            />
                            <input 
                            onChange={(e) => props.onUploadAttachment(e.target.files)}
                            type={'file'} 
                            style={{ display: 'none'}}
                            />
                        </Styled.AddNewFileButton>
                    </Tooltip>
                </Styled.ContainerWrapper>
            ) : (
                <Styled.Button>
                    <Styled.ButtonIcon icon={faFileUpload}/>
                    <Styled.ButtonPlaceholderText>
                        {typeof props.field.placeholder === 'string' ? 
                            props.field.placeholder : strings('formularyFieldAttachmentPlaceholder')}
                    </Styled.ButtonPlaceholderText>
                    <input 
                    onChange={(e) => props.onUploadAttachment(e.target.files)}
                    type={'file'} 
                    style={{ display: 'none'}}
                    />
                </Styled.Button>
            )}
        </Styled.Container>
    )
}