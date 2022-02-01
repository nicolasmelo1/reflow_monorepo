import { strings } from '../../../../core'
import {
    faFileUpload
} from '@fortawesome/free-solid-svg-icons'
import Styled from '../styles'

export default function FormularyFieldAttachmentWebLayout(props) {
    return (
        <Styled.Container>
            <Styled.Button>
                <Styled.ButtonIcon icon={faFileUpload}/>
                <Styled.ButtonPlaceholderText>
                    {typeof props.field.placeholder === 'string' ? 
                        props.field.placeholder : strings('pt-BR', 'formularyFieldAttachmentPlaceholder')}
                </Styled.ButtonPlaceholderText>
            </Styled.Button>
        </Styled.Container>
    )
}