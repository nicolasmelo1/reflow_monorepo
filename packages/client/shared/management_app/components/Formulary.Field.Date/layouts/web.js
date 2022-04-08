import { Switch, Datepicker, strings } from '../../../../core'
import Styled from '../styles'

export function DropdownMenuDateFormatOptionWebLayout(props) {
    return (
        <Styled.DropdownMenuContainer>
            <Styled.DropdownMenuSwitchContainer
            onClick={() => props.onToggleAutoCreate(!props.isToAutoCreate)}
            >
                <Switch
                isSelected={props.isToAutoCreate}
                onSelect={() => props.onToggleAutoCreate(!props.isToAutoCreate)}
                />
                <Styled.DropdownMenuSwitchLabel>
                    {strings('formularyFieldDateDropdownMenuAutomaticToCreate')}
                </Styled.DropdownMenuSwitchLabel>
            </Styled.DropdownMenuSwitchContainer>
            <Styled.DropdownMenuSwitchContainer
            onClick={() => props.onToggleAutoUpdate(!props.isToAutoUpdate)}
            >
                <Switch
                isSelected={props.isToAutoUpdate}
                onSelect={() => props.onToggleAutoUpdate(!props.isToAutoUpdate)}
                />
                <Styled.DropdownMenuSwitchLabel>
                    {strings('formularyFieldDateDropdownMenuAutomaticToCreate')}
                </Styled.DropdownMenuSwitchLabel>
            </Styled.DropdownMenuSwitchContainer>
        </Styled.DropdownMenuContainer>
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