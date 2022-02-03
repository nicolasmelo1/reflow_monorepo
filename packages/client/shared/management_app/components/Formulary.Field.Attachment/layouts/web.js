import { Tooltip, strings } from '../../../../core'
import {
    faFileUpload
} from '@fortawesome/free-solid-svg-icons'
import Styled from '../styles'

export default function FormularyFieldAttachmentWebLayout(props) {
    const hasValuesDefined = props.values.length !== 0

    return (
        <Styled.Container>
            {hasValuesDefined ? (
                <Styled.ContainerWrapper>
                    {props.values.map(value => (
                        <Styled.FileContainer
                        key={value.uuid}
                        >
                            <Styled.ImageWrapper>
                                <img
                                style={{ width: '100%' }}
                                src={props.drafts.retrieveUrl(value.value)}
                                />
                            </Styled.ImageWrapper>
                        </Styled.FileContainer>
                    ))}
                </Styled.ContainerWrapper>
            ) : (
                <Tooltip>
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
                </Tooltip>
            )}
        </Styled.Container>
    )
}