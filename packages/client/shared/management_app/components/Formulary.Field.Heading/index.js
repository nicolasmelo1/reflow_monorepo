import { useRef, useState, useEffect } from 'react'
import { APP } from '../../../conf'
import { useClickedOrPressedOutside } from '../../../core'
import useHeadingField from '../../hooks/useHeadingField'
import Layout from './layouts'

export function FormularyFieldHeadingDropdownMenu(props) {
    function onClickToRename() {
        props.onToggleRenaming()
    }

    return (
        <Layout.DropdownMenu
        renameButtonRef={props.renameButtonRef}
        onClickToRename={onClickToRename}
        />
    )
}
// ---------------------------------------------------------------------------------------------------------------------
export default function FormularyFieldHeading(props) {
    const validHeadingTypes = ['heading1', 'heading2', 'heading3']
    const isValidHeadingType = typeof props.headingType === 'string' && validHeadingTypes.includes(props.headingType)
    const headingType = isValidHeadingType ? props.headingType : 'heading1'
    const isNewField = typeof props.isNewField === 'boolean' ? props.isNewField : false

    const {
        inputRef,
        isRenaming,
        onToggleRenaming
    } = useHeadingField(
        props.onToggleEditFieldMenu, 
        props.addComponentForFieldSpecificOptionsForDropdownMenu,
        isNewField
    )

    /**
     * Changes the value of the heading name to display in this field. Be aware, this field type does not have values, so the only thing
     * we change is the label.
     * 
     * @param {string} headingName - The new heading name to display in this field.
     */
    function onChangeHeadingName(newName) {
        props.field.label.name = newName
        props.onUpdateFormulary()
    }


    return (
        <Layout.Field
        inputRef={inputRef}
        headingType={headingType}
        onToggleRenaming={onToggleRenaming}
        onChangeHeadingName={onChangeHeadingName}
        isRenaming={isRenaming}
        field={props.field}
        />
    )
}