import { useState, useEffect } from 'react'
import Layouts from './layouts'

export default function FormularyFieldOption(props) {
    const [options, setOptions] = useState(props.field.options.map(option => ({ value: option.uuid, label: option.value })))
    const [isOpen, setIsOpen] = useState(false)

    function onOpenSelect(selectIsOpen) {
        setIsOpen(selectIsOpen)
    }

    useEffect(() => {
        if (JSON.stringify(options) !== JSON.stringify(props.field.options)) {
            setOptions(props.field.options.map(option => ({ value: option.uuid, label: option.value })))
        }
    }, [props.field.options])

    return process.env['APP'] === 'web' ? (
        <Layouts.Web
        isOpen={isOpen}
        onOpenSelect={onOpenSelect}
        options={options}
        types={props.types}
        field={props.field}
        />
    ) : (
        <Layouts.Mobile/>
    )
}
