import { useRef, useState, useEffect } from 'react'
import Layouts from './layouts'

function NumberFormatOption(props) {
    const menuRef = useRef()
    const menuButtonRef = useRef()
    const [menuPosition, setMenuPosition] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const [selected, setSelected] = useState(props.selectedId)

    function onSelect(id) {
        setSelected(id)
        props.onSelect(id)
        setIsOpen(false)
    }

    function onOpenMenu(isMenuOpen=!isOpen) {
        setIsOpen(isMenuOpen)
        if (process.env['APP'] === 'web' && isMenuOpen === true) {
            setTimeout(() => {
                if (menuButtonRef.current && menuRef.current) {
                    const menuRect = menuRef.current.getBoundingClientRect()
                    const menuButtonRect = menuButtonRef.current.getBoundingClientRect()
                    const position = {
                        x: menuButtonRect.x - menuRect.width,
                        y: menuButtonRect.y - (menuRect.height / 2)
                    }
                    setMenuPosition(position)
                }
            }, 1)
        }
    }

    return process.env['APP'] === 'web' ? (
        <Layouts.Web.DropdownMenu
        menuRef={menuRef}
        menuButtonRef={menuButtonRef}
        menuPosition={menuPosition}
        isOpen={isOpen}
        onOpenMenu={onOpenMenu}
        selected={selected}
        onSelect={onSelect}
        numberFormatTypes={props.numberFormatTypes}
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
        const selectedNumberFormatTypeId = typeof(props.field.numberField) === 'object' ? 
            props.field.numberField.numberFormatTypeId : null
        props.addComponentsForFieldSpecificOptionsForDropdownMenu([
            <NumberFormatOption
            key={`numberFormatOption-${props.field.uuid}`}
            selectedId={selectedNumberFormatTypeId}
            numberFormatTypes={props.types.numberFormatType}
            onSelect={onChangeFormatType}
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
