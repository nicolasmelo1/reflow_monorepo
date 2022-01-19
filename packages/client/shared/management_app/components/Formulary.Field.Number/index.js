import { useState, useEffect } from 'react'
import Layouts from './layouts'

function NumberFormatOption(props) {
    const [value, setValue] = useState('')

    function onChangeValue(newValue) {
        setValue(newValue)
        props.onChange(newValue)
    }

    return process.env['APP'] === 'web' ? (
        <Layouts.Web.DropdownMenu
        value={value}
        onChange={onChangeValue}
        />
    ) : (
        <Layouts.Mobile.DropdownMenu/>
    )
}

export default function FormularyFieldNumber(props) {
    function onChangeFormatType(option) {
        console.log(option)
    }

    useEffect(() => {
        props.addComponentsForFieldSpecificOptionsForDropdownMenu([
            <NumberFormatOption
            key={`numberFormatOption-${props.field.uuid}`}  
            onChange={onChangeFormatType}
            />
        ])
    }, [])

    return process.env['APP'] === 'web' ? (
        <Layouts.Web.Field
        types={props.types}
        field={props.field}
        />
    ) : (
        <Layouts.Mobile.Field/>
    )
}
