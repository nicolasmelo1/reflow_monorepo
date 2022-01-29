import { useState } from 'react'
import Layouts from './layouts'

export default function FormularyFieldDate(props) {
    const [isOpen, setIsOpen] = useState(false)

    return process.env['APP'] === 'web' ? (
        <Layouts.Web
        types={props.types}
        field={props.field}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        />
    ) : (
        <Layouts.Mobile/>
    )
}
