import { useState, useEffect, useRef } from 'react'
import { useClickedOrPressedOutside } from '../../core'
import { APP } from '../../conf'
import { HeadingDropdownMenuOptions } from '../components/Formulary.Field.Heading'

/**
 * This is the logic for the heading field supposed to be used anywhere outside of the heading field itself, for example the kanban board,
 * the list and so on.
 * 
 * @param {{
 *      uuid: string,
 *      name: string,
 *      labelName: string,
 *      labelIsHidden: boolean,
 *      fieldIsHidden: boolean,
 *      fieldTypeId: number,
 *      label: {
 *          name: string
 *      },
 *      isUnique: boolean,
 *      options: Array<{
 *          uuid: string, 
 *          value: string, 
 *          order: number, 
 *          color: string
 *      }>,
 *      placeholder: null | string,
 *      required: boolean
 * }} fieldData - The data of the field that is being edited.
 * @param {(fieldData: object, namespaces: Array<string>) => void} onChangeField - This is the function that is called when the user 
 * changes the value of the field.
 * @param {(isEditFieldMenuOpen: boolean) => void} onToggleEditFieldMenu - A callback to toggle the edit field menu.
 * @param {(component: import('react').ReactElement, props: object) => void} registerComponentForFieldSpecificOptionsForDropdownMenu - This 
 * component will be used to hold the specific options for this field on the dropdown menu.
 * @param {boolean} [isNewField=false] - Whether this field is a new field or not. By default it's not.
 * 
 * @returns {{
 *      inputRef: import('react').RefObject<HTMLInputElement>,
 *      isRenaming: boolean,
 *      onToggleRenaming: (isRenamingHeader: boolean) => void,  
 *      onChangeHeadingName: (newName: string) => void
 * }} - Returns a ref to append to the rename input, a boolean that is the state if the field is being renamed or not, a callback
 * to toggle on or off if the field is being renamed or not and the function that is supposed to be called whenever the user writes
 * on the input to rename the heading.
 */
export default function useHeadingField(
    fieldData, onChangeField, onToggleEditFieldMenu, registerComponentForFieldSpecificOptionsForDropdownMenu, 
    isNewField=false
) {
    const renameButtonRef = useRef()
    const [field, setField] = useState(fieldData)
    const [isRenaming, setIsRenaming] = useState(isNewField)
    const { ref: inputRef } = useClickedOrPressedOutside({
        callback: (event) => {
            if (APP === 'web') {
                const isRenameButtonRefDefined = ![undefined, null].includes(renameButtonRef.current)
                if (isRenameButtonRefDefined) {
                    if (renameButtonRef.current.contains(event.target)) {
                        onToggleRenaming(false)
                    }
                } else {
                    onToggleRenaming(false)
                }
            }
        }
    })

    /**
     * Toggle the renaming state, is the user renaming or not?
     * 
     * @param {boolean} isRenamingHeader - Is the user renaming the header?
     */
    function onToggleRenaming(isRenamingHeader=!isRenaming) {
        if (isRenamingHeader === true) {
            onToggleEditFieldMenu(false)
        }
        setIsRenaming(isRenamingHeader)
    }


    /**
     * Changes the value of the heading name to display in this field. Be aware, this field type does not have values, so the only thing
     * we change is the label.
     * 
     * @param {string} headingName - The new heading name to display in this field.
     */
    function onChangeHeadingName(newName) {
        field.label.name = newName
        setField(field)
        onChangeField(field, ['label', 'name'])
    }

    /**
     * This effect runs when the component is loaded, when it is loaded what we do is that we register the custom
     * option on the dropdown menu when editing the `heading` field type.
     */
    useEffect(() => {
        registerComponentForFieldSpecificOptionsForDropdownMenu(HeadingDropdownMenuOptions, {
            onToggleRenaming,
            renameButtonRef
        })
    }, [])

    /**
     * When the external field changes we should also change the internal field value.
     */
    useEffect(() => {
        const isFieldDifferentFromStateField = typeof fieldData !== typeof field && JSON.stringify(fieldData) !== JSON.stringify(field)
        if (isFieldDifferentFromStateField) {
            setField(fieldData)
        }
    }, [fieldData])

    return {
        inputRef,
        isRenaming,
        onToggleRenaming,
        onChangeHeadingName
    }
}