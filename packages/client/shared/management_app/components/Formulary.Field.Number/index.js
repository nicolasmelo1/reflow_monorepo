import { useRef, useState, useEffect, useContext } from 'react'
import { useDropdownMenuSelect } from '../../hooks'
import { strings } from '../../../core'
import { generateUUID } from '../../../../../shared/utils'
import Layout from './layouts'
import { AppManagementTypesContext } from '../../contexts'
import useNumberField from '../../hooks/useNumberField'

export function NumberDropdownMenuOptions(props) {
    const menuRef = useRef()
    const menuButtonRef = useRef()
    
    const [selected, setSelected] = useState(props.selectedId)

    const { state: { types } } = useContext(AppManagementTypesContext)

    const { isOpen, onOpenMenu, menuPosition } = useDropdownMenuSelect({
        buttonRef: menuButtonRef,
        menuRef: menuRef
    })
    
    function onSelect(id) {
        setSelected(id)
        props.onSelect(id)
        onOpenMenu(false)
    }

    /**
     * This is used to retrieve the number formatTypeString by the numberFormatTypeName, instead of showing
     * `percentage`, 'integer' and so on, we translate it to a more human readable label.
     * 
     * @param {string} numberFormatTypeName - Can be one of `number`, 'integer', 'percentage' or 'monetary'.
     * BUT BEAWARE, this can change at any type, that's why we don't add it to the specification of the param.
     * 
     * @returns {string} - Returns the numberFormatTypeName string if no translation is found, or return the actual
     * label translation.
     */
    function getNumberFormatTypeStringByName(numberFormatTypeName) {
        const capitalizedNumberFormatTypeName = numberFormatTypeName.charAt(0).toUpperCase() + 
            numberFormatTypeName.slice(1)
        const name = strings(`numberFormatType${capitalizedNumberFormatTypeName}Label`)
        return name !== undefined ? name : numberFormatTypeName
    }

    return (
        <Layout.DropdownMenu
        menuRef={menuRef}
        menuButtonRef={menuButtonRef}
        menuPosition={menuPosition}
        isOpen={isOpen}
        onOpenMenu={onOpenMenu}
        selected={selected}
        onSelect={onSelect}
        getNumberFormatTypeStringByName={getNumberFormatTypeStringByName}
        numberFormatTypes={types.numberFormatTypes}
        />
    )
}

export default function FormularyFieldNumber(props) {
    useNumberField(
        props.field, 
        props.onChangeFieldConfiguration, 
        props.registerComponentForFieldSpecificOptionsForDropdownMenu,
        props.registerOnDuplicateOfField
    )

    return (
        <Layout.Field
        types={props.types}
        field={props.field}
        />
    )
}
