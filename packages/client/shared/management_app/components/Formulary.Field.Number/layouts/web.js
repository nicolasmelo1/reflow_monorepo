import Styled from '../styles'

export default function FormularyFieldNumberWebLayout(props) {
    return (
        <Styled.Container>
            <Styled.Input 
            placeholder={props.field.placeholder}
            type={'text'}
            />
        </Styled.Container>
    )
}