import { Tooltip, strings } from '../../../../core'
import {
    faFileUpload,
    faPlusSquare
} from '@fortawesome/free-solid-svg-icons'
import Styled from '../styles'

export default function FormularyFieldAttachmentWebLayout(props) {
    const hasValuesDefined = props.values.length !== 0

    return (
        <Styled.Container>
            {hasValuesDefined ? (
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
                                        style={{ width: '100%' }}
                                        src={draftInformation.url}
                                        />
                                    </Styled.ImageWrapper>
                                </Styled.FileContainer>
                            </Tooltip>
                        )
                    })}
                    <Tooltip
                    placement={['bottom', 'top']}
                    text={typeof(props.field.placeholder) === 'string' ? props.field.placeholder : strings('pt-BR', 'formularyFieldAttachmentPlaceholder')}
                    >
                        <Styled.AddNewFileButton>
                            <Styled.AddNewFileButtonIcon 
                            icon={faPlusSquare}
                            />
                            <input 
                            onChange={(e) => props.onUploadAttachment(e.target.files[0])}
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
                            props.field.placeholder : strings('pt-BR', 'formularyFieldAttachmentPlaceholder')}
                    </Styled.ButtonPlaceholderText>
                    <input 
                    onChange={(e) => props.onUploadAttachment(e.target.files[0])}
                    type={'file'} 
                    style={{ display: 'none'}}
                    />
                </Styled.Button>
            )}
        </Styled.Container>
    )
}