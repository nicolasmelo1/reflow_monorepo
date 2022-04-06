import { Datepicker } from '../../../../core'
import Styled from '../styles'

export function DropdownMenuDateFormatOptionWebLayout(props) {
    return (
        <div></div>
    )
}

export default function FormularyFieldDateWebLayout(props) {
    return (
        <Styled.Container>
            <Datepicker
            dateFormat={'DD/MM/YYYY'}
            placeholder={props.field.placeholder}
            onOpenDatepicker={props.onToggleDatepicker}
            customInputComponent={Styled.CustomInputForDatepicker}
            />
        </Styled.Container>
    )
}