import { Datepicker } from '../../../../core'
import Styled from '../styles'


export default function FormularyFieldDateWebLayout(props) {
    return (
        <div>
            <Datepicker
            onOpenDatepicker={props.setIsOpen}
            customInputComponent={Styled.CustomInputForDatepicker}
            />
        </div>
    )
}