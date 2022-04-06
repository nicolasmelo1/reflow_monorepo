import { Fragment } from 'react'
import { Tooltip, strings, Loading } from '../../../../core'
import {
    faFileUpload,
    faPlusSquare,
    faChevronLeft,
    faChevronRight,
    faTrash,
    faTimes
} from '@fortawesome/free-solid-svg-icons'
import Styled from '../styles'

export default function FormularyFieldAttachmentWebLayout(props) {
    const hasValuesDefined = props.values.length !== 0
    const isDraggingFileOver = props.draggingOver.isDraggingOver
    const heightOfContainerWhileDraggingFileOver = props.draggingOver.heightOfContainer
    const isUploading = props.isUploading

    return (
        <Styled.Container
        ref={props.containerRef}
        isDraggingOver={isDraggingFileOver}
        heightOfContainer={heightOfContainerWhileDraggingFileOver}
        onDragOver={(e) => {
            e.preventDefault()
            e.stopPropagation()
            props.webOnToggleDraggingOver(true, props.containerRef.current.offsetHeight)
        }}
        onDragLeave={(e) => {
            e.preventDefault()
            e.stopPropagation()
            if (isDraggingFileOver === true) {
                props.webOnToggleDraggingOver(false)
            }
        }}
        onDragEnter={(e) => {
            e.preventDefault()
            e.stopPropagation()
            if (isDraggingFileOver === false && e?.dataTransfer?.items && e.dataTransfer.items.length > 0) {
                props.webOnToggleDraggingOver(true, props.containerRef.current.offsetHeight)
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
            <Styled.ContainerWrapper>
                {isUploading === true ? (
                    <Fragment>
                        <div
                        style={{ width: '70px'}}
                        >
                            <Loading/>
                        </div>
                        {'Aguarde...'}
                    </Fragment>

                ) : isDraggingFileOver === true ? (
                    <Styled.DragAndDropMessage>
                        {strings('formularyFieldAttachmentDragAndDropFileMessage')}
                    </Styled.DragAndDropMessage>
                ) : hasValuesDefined === true ? (
                    <Styled.FilesScrollerContainer>
                        {props.values.map((value, index) => {
                            const attachmentInformation = props.retrieveFileNameAndUrlByValue(value.uuid, value.value)
                            const fileName = attachmentInformation.fileName
                            const fileUrl = attachmentInformation.url
                            const isValueDetailOpened = props.valueUUIdOpened === value.uuid
                            const hasValueToTheLeft = props.values[index - 1] !== undefined
                            const hasValueToTheRight = props.values[index + 1] !== undefined

                            return (
                                <Fragment
                                key={value.uuid}
                                >
                                    <Tooltip
                                    placement={['bottom', 'top']}
                                    text={fileName}
                                    >
                                        <Styled.FileContainer>
                                            <Styled.ImageWrapper
                                            onClick={() => props.onChangeOpenedUUIDValue(value.uuid)}
                                            >
                                                <img
                                                style={{ maxWidth: '100%', maxHeight: '100%' }}
                                                src={fileUrl}
                                                />
                                            </Styled.ImageWrapper>
                                        </Styled.FileContainer>
                                    </Tooltip>
                                    {isValueDetailOpened === true ? (
                                        <Styled.DetailContainer>
                                            <Styled.DetailHeader>
                                                <Tooltip
                                                text={strings('formularyFieldAttachmentDetailCloseButtonDescriptionLabel')}
                                                >
                                                    <Styled.DetailCloseButton
                                                    onClick={() => props.onChangeOpenedUUIDValue(null)}
                                                    >
                                                        <Styled.DetailCloseButtonIcon 
                                                        icon={faTimes}
                                                        />
                                                    </Styled.DetailCloseButton>
                                                </Tooltip>
                                                <Styled.DetailHeaderTitle>
                                                    {fileName}
                                                </Styled.DetailHeaderTitle>
                                            </Styled.DetailHeader>
                                            <Styled.DetailContent>
                                                <Styled.ArrowButton
                                                onClick={() => hasValueToTheLeft === true ? props.onChangeOpenedUUIDValue(props.values[index - 1].uuid) : null}
                                                disabled={hasValueToTheLeft === false}
                                                >
                                                    {hasValueToTheLeft === true ? (
                                                        <Styled.ArrowsIcon 
                                                        icon={faChevronLeft}
                                                        />
                                                    ) : ''}
                                                </Styled.ArrowButton>
                                                <Styled.DetailContentContainer>
                                                    <img
                                                    draggable={false}
                                                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                                                    src={fileUrl}
                                                    />
                                                </Styled.DetailContentContainer>
                                                <Styled.ArrowButton
                                                onClick={() => hasValueToTheRight === true ? props.onChangeOpenedUUIDValue(props.values[index + 1].uuid) : null}
                                                disabled={hasValueToTheRight === false}
                                                >
                                                    {hasValueToTheRight === true ? (
                                                        <Styled.ArrowsIcon 
                                                        icon={faChevronRight}
                                                        />
                                                    ) : ''}
                                                </Styled.ArrowButton>
                                            </Styled.DetailContent>
                                            <Styled.DetailFooter>
                                                <Styled.DetailFooterButtonsContainer>
                                                    <Tooltip
                                                    text={strings('formularyFieldAttachmentDetailRemoveButtonDescriptionLabel')}
                                                    >
                                                        <Styled.DetailFooterButton
                                                        onClick={() => props.onRemoveAttachment(value.uuid)}
                                                        >
                                                            <Styled.DetailFooterButtonIcon 
                                                            icon={faTrash}
                                                            />
                                                        </Styled.DetailFooterButton>
                                                    </Tooltip>
                                                </Styled.DetailFooterButtonsContainer>
                                                <Styled.DownloadButton
                                                onClick={() => props.onDownloadAttachmentFile(value.uuid)}
                                                >
                                                    {strings('formularyFieldAttachmentDetailDownloadButtonDescriptionLabel')}
                                                </Styled.DownloadButton>
                                            </Styled.DetailFooter>
                                        </Styled.DetailContainer>
                                    ) : ''}
                                </Fragment>
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
                    </Styled.FilesScrollerContainer>
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
            </Styled.ContainerWrapper>
        </Styled.Container>
    )
}