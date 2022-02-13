import Styled from '../styles'

export default function FormularyFieldEmailWebLayout(props) {
    return (
        <Styled.Container>
            <Styled.Input 
            onChange={(e) => props.onChangeValue(e.target.value)}
            placeholder={props.field.placeholder}
            autoComplete={'off'}
            type={'email'}
            />
        </Styled.Container>
    )
}