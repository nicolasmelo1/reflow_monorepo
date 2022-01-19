import Styled from '../styles'

export function DropdownMenuNumberFormatOptionWebLayout(props) {
    return (
        <input
        type={'text'}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        />
    )
}

export default function FormularyFieldNumberWebLayout(props) {
    return (
        <Styled.Container>
            <Styled.Input 
            autoComplete={'whathever'}
            placeholder={props.field.placeholder}
            type={'text'}
            />
        </Styled.Container>
    )
}