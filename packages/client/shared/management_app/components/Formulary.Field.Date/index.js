import { useState } from 'react'
import Layout from './layouts'

export default function FormularyFieldDate(props) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Layout
        types={props.types}
        field={props.field}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        />
    ) 
}
