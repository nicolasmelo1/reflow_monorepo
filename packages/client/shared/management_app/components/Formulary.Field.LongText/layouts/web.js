import Styled from '../styles'

export default function FormularyFieldLongTextWebLayout(props) {
    return (
        <Styled.Container>
            <Styled.TextArea 
            ref={props.textAreaRef}
            placeholder={props.field.placeholder}
            rows={1}
            autoComplete={'off'}
            type={'text'}
            />
        </Styled.Container>
    )
}