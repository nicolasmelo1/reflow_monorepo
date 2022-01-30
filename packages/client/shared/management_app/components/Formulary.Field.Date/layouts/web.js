import { Datepicker } from '../../../../core'
import Styled from '../styles'


export default function FormularyFieldDateWebLayout(props) {
    return (
        <Styled.Container>
            <Datepicker
            dateFormat={'DD/MM/YYYY'}
            onOpenDatepicker={props.setIsOpen}
            customInputComponent={Styled.CustomInputForDatepicker}
            />
        </Styled.Container>
    )
}