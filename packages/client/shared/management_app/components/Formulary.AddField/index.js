import { useState, useContext } from 'react'
import { generateUUID } from '../../../../../shared/utils'
import { WorkspaceContext } from '../../../authentication/contexts'
import { useOpenFloatingDropdown, useClickedOrPressedOutside } from '../../../core'
import { useFieldTypes } from '../../hooks'
import Layout from './layouts'

export default function FormularyAddField(props) {
    const [isHovered, setIsHovered] = useState(false)
    const { state: { selectedWorkspace: { isAdmin: isUserAnAdmin } } } = useContext(WorkspaceContext)
    const {
        dropdownButtonRef: addButtonRef,
        dropdownMenuRef: fieldTypeOptionsMenuRef,
        isDropdownOpen: isFieldTypeOptionsSelectorOpen,
        dropdownMenuPosition: fieldTypeOptionsMenuPosition,
        onToggleDropdownMenu: onToggleFieldTypeOptionSelectionMenu
    } = useOpenFloatingDropdown({ isCentered: true })
    const {
        getIconByFieldTypeId,
        getFieldTypeLabelNameByFieldTypeId
    } = useFieldTypes(props.fieldTypes)

    useClickedOrPressedOutside({ ref: fieldTypeOptionsMenuRef, callback: (e) => {
        if (addButtonRef.current && !addButtonRef.current.contains(e.target)) {
            onToggleFieldTypeOptionSelectionMenu(false)
            onToggleHover(false)
        }
    }})
    
    function onAddNewField(fieldTypeId) {
        onToggleFieldTypeOptionSelectionMenu(false)
        onToggleHover(false)
        props.onAddField({
            fieldIsHidden: false,
            isUnique: false,
            labelIsHidden: false,
            fieldTypeId, // change this
            labelName: getFieldTypeLabelNameByFieldTypeId(fieldTypeId),
            name: 'novocampo',
            options: [],
            placeholder: null,
            required: false,
            uuid: generateUUID()
        })
    }

    /**
     * Function used for when the user hovers over a field. The button will only be shown when the user hovers
     * over it otherwise it will be dismissed for him.
     * 
     * @param {boolean} isHovering - Is the user hovering over the button with the mouse or not?
     */
    function onToggleHover(isHovering=!isHovered) {
        const doesUserHasPermissionToHoverOverButton = isHovering === true && isUserAnAdmin === true
        if (doesUserHasPermissionToHoverOverButton) {
            setIsHovered(isHovering)
        } else {
            setIsHovered(false)
        }
    }

    return (
        <Layout
        addButtonRef={addButtonRef}
        fieldTypeOptionsMenuRef={fieldTypeOptionsMenuRef}
        onToggleFieldTypeOptionSelectionMenu={onToggleFieldTypeOptionSelectionMenu}
        isFieldTypeOptionsSelectorOpen={isFieldTypeOptionsSelectorOpen}
        fieldTypeOptionsMenuPosition={fieldTypeOptionsMenuPosition}
        fieldTypes={props.fieldTypes}
        getIconByFieldTypeId={getIconByFieldTypeId}
        getFieldTypeLabelNameByFieldTypeId={getFieldTypeLabelNameByFieldTypeId}
        isHovered={isHovered}
        onToggleHover={onToggleHover}
        onAddNewField={onAddNewField}
        />
    )
}