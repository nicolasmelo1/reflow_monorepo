import { Select } from '../../../../core'
import Styled from '../styles'

export default function FormularyFieldOptionWebLayout(props) {
    return (
        <Styled.Container
        isOpen={props.isOpen}
        >
            <Select
            onOpen={props.onOpenSelect}
            isOpen={props.isOpen}
            options={props.options}
            />
        </Styled.Container>
    )
}