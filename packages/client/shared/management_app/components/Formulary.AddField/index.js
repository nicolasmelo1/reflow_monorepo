import { useState, useContext } from 'react'
import { generateUUID } from '../../../../../shared/utils'
import { WorkspaceContext } from '../../../authentication/contexts'
import { useOpenFloatingDropdown, useClickedOrPressedOutside } from '../../../core'
import { useFieldTypes } from '../../hooks'
import Layout from './layouts'

/**
 * This component is just a button that is used to add new fields inside other fields or a section.
 * If you need to add a field inside of any thing you should use this component.
 * 
 * @param {object} props - The props of the component.
 * @param {object} props.fieldTypes - All of the field types accepted that we can add to the formulary/field.
 * @param {(fieldData: {
 *      fieldIsHidden: boolean,
 *      isUnique: boolean,
 *      labelIsHidden: boolean,
 *      fieldTypeId: number,
 *      labelName: string,
 *      name: string,
 *      options: [],
 *      placeholder: null | string,
 *      required: boolean,
 *      uuid: string}
 * ) => void} props.onAddField - A function that is called when the user clicks the button to add a new field.
 */
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
    
    /**
     * This function is called after the user selects a field type from the dropdown menu. This field type will
     * create a new field in the formulary.
     * 
     * After we click the button to add a new field we need to toggle off the hover and the dropdown menu of the
     * field type selection options
     * 
     * @param {number} fieldTypeId - The id of the field type that the user selected.
     */
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