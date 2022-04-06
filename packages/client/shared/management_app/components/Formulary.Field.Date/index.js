import { useDateField } from '../../hooks'
import Layout from './layouts'

export function DateFormatOption(props) {
    return (
        <Layout.DropdownMenu
        />
    )
}
// ------------------------------------------------------------------------------------------
export default function FormularyFieldDate(props) {    
    const { 
        isDatepickerOpen, onToggleDatepicker
    } = useDateField(props.field, props.onChangeField, props.registerOnDuplicateOfField)

    return (
        <Layout.Field
        types={props.types}
        field={props.field}
        onToggleDatepicker={onToggleDatepicker}
        isOpen={isDatepickerOpen}
        />
    ) 
}
