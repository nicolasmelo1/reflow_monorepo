import Styled from '../styles'

export default function FormularyFieldTextWebLayout(props) {
    return (
        <Styled.Container>
            <Styled.Input 
            placeholder={props.field.placeholder}
            autoComplete={'whathever'}
            type={'text'}
            />
        </Styled.Container>
    )
}