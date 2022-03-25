import { useState, useEffect, useRef } from 'react'
import { useClickedOrPressedOutside } from '../../core'
import { APP } from '../../conf'
import { FormularyFieldHeadingDropdownMenu } from '../components/Formulary.Field.Heading'

/**
 * This is the logic for the heading field supposed to be used anywhere outside of the heading field itself, for example the kanban board,
 * the list and so on.
 * 
 * @param {(isEditFieldMenuOpen: boolean) => void} onToggleEditFieldMenu - A callback to toggle the edit field menu.
 * @param {(component: import('react').ReactElement, props: object) => void} addComponentForFieldSpecificOptionsForDropdownMenu - This 
 * component will be used to hold the specific options for this field on the dropdown menu.
 * @param {boolean} [isNewField=false] - Whether this field is a new field or not. By default it's not.
 * 
 * @returns {{
 *      inputRef: import('react').RefObject<HTMLInputElement>,
 *      isRenaming: boolean,
 *      onToggleRenaming: (isRenamingHeader: boolean) => void,  
 * }} - Returns a ref to append to the rename input, a boolean that is the state if the field is being renamed or not and a callback
 * to toggle on or off if the field is being renamed or not.
 */
export default function useHeadingField(
    onToggleEditFieldMenu, addComponentForFieldSpecificOptionsForDropdownMenu, 
    isNewField=false
) {
    const renameButtonRef = useRef()
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

    useEffect(() => {
        addComponentForFieldSpecificOptionsForDropdownMenu(FormularyFieldHeadingDropdownMenu, {
            onToggleRenaming,
            renameButtonRef
        })
    }, [])

    return {
        inputRef,
        isRenaming,
        onToggleRenaming
    }
}