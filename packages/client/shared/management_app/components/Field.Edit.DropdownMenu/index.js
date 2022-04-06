import { useContext, useState, useEffect } from 'react'
import { APP } from '../../../conf'
import { useClickedOrPressedOutside, useOpenFloatingDropdown } from '../../../core'
import { AppManagementTypesContext } from '../../contexts'
import { useFieldTypes } from '../../hooks'
import Layout from './layouts'

/**
 * This component is responsible for adding the dropdown menu to the field, this means that what this does is load the menu
 * dropdown when the user clicks the button to edit the field.
 * 
 * @param {object} props - The props that this component recieves
 * @param {import('react').RefObject<HTMLButtonElement>} props.buttonRef - The ref to the button that will open 
 * the dropdown menu when clicked. IMPORTANT: this can't be dynamic, so once you render this component passing 
 * the ref of the button then it's this button we will use.
 * @param {boolean} props.isOpen - Is the menu open o closed.
 * @param {(isOpen: boolean) => void} props.onToggleDropdownMenu - A function that is called when we close the menu.
 * This way we can control the behavior of the menu outside of this component.
 * @param {(fieldData: object) => void} props.onChangeField - This is called when the field changes.
 * @param {boolean} [props.isRenaming=false] - Is the field being renamed or not? By default it's not.
 * @param {(isRenaming: boolean) => void} [props.onToggleIsRenaming=undefined] - The callback that will be called when the user clicks to rename
 * the field.
 * 
 * @returns {import('react').ReactElement} - Returns a react element when rendered.
 */
 export default function FieldEditDropdownMenu(props) {
    const defaultInitialIsRenamingState = typeof props.isRenaming === 'boolean' ? props.isRenaming : false

    const [isRenaming, setIsRenaming] = useState(defaultInitialIsRenamingState)
    const [isPlaceholderOpen, setIsPlaceholderOpen] = useState(!['', null, undefined].includes(props.field.placeholder))
    const { state: { types } } = useContext(AppManagementTypesContext)
    const {
        dropdownButtonRef: fieldEditMenuButtonRef,
        dropdownMenuRef: fieldEditDropdownMenuRef,
        webLoadDropdownMenuTopOrDownAndDefineHeight: webLoadEditMenuTopOrDownAndDefineHeight,
        isDropdownOpen: isEditMenuOpen,
        dropdownMenuPosition: editMenuPosition,
        onToggleDropdownMenu
    } = useOpenFloatingDropdown({ isOpen: props.isOpen })
    const { 
        getTypesById
    } = useFieldTypes(types.fieldTypes)
    useClickedOrPressedOutside({ 
        customRef: fieldEditDropdownMenuRef, 
        callback: (e) => {
            if (fieldEditMenuButtonRef.current && !fieldEditMenuButtonRef.current.contains(e.target)) {
                onToggleEditFieldMenu(false)
            }
        }
    })

    /**
     * / * WEB ONLY * /
     * 
     * Function called only on web, when the user scrolls anything outside of the dropdown menu.
     * 
     * @param {Event} e - The scroll event that triggered this function.
     */
    function webOnScroll(e) {
        const scrollingElementIsNotTheMenu = fieldEditDropdownMenuRef.current && !fieldEditDropdownMenuRef.current.contains(e.target) 
        const isButtonDefined = ![null, undefined].includes(fieldEditMenuButtonRef.current)
        if (scrollingElementIsNotTheMenu && isButtonDefined) {
            webLoadEditMenuTopOrDownAndDefineHeight()
        }
    }

    /**
     * This is called whenever we want to close or open the dropdown menu. If the `onToggleDropdownMenu` props is defined
     * we will also call the parent function.
     * 
     * @param {boolean} [isOpen=!isEditMenuOpen] - Is the menu open or closed.
     */
    function onToggleEditFieldMenu(isOpen=!isEditMenuOpen) {
        const isOnToggleDropdownMenuDefined = typeof props.onToggleDropdownMenu === 'function'
        if (isOnToggleDropdownMenuDefined) {
            props.onToggleDropdownMenu(isOpen)
        }
        onToggleDropdownMenu(isOpen)
    }

    /**
     * When we change the data of the field we call this function, with this we will do two things:
     * - Update the internal state of the field.
     * - Call the `onChangeField` props function to change the field.
     */
    function onChangeField(fieldData) {
        props.onChangeField(fieldData)
    }
    
    /**
     * This will change if the field is required or not. This means, the field can or cannot be empty.
     *
     * If we have hid the field we cannot make it obligatory since we cannot change it's value.
     * 
     * @param {boolean} [isRequired=!props.field.isRequired] - Whether or not the field is required.
     */
    function onChangeFieldIsRequired(isRequired=!props.field.isRequired) {
        if (props.field.fieldIsHidden === false && isRequired === true) {
            props.field.required = isRequired
            onChangeField(props.field)
        } else if (isRequired === false) {
            props.field.required = isRequired
            onChangeField(props.field)
        }
    }   

    /**
     * Change if the label of the field is visible or not. If it is then we show the name of the field at the top, otherwise
     * we do not show any label at the top.
     * 
     * @param {boolean} [isLabelVisible=!props.field.labelIsHidden] - Whether or not the label of the field is visible.
     */
    function onChangeLabelIsHidden(isLabelHidden=!props.field.labelIsHidden) {
        props.field.labelIsHidden = isLabelHidden
        onChangeField(props.field)
    }

    /**
     * Change wheather or not the field is visible or not. If the field is hidden we will not show the field to the user, 
     * the field is the input. Otherwise we show it to the user.
     * When we hide the field, we cannot make it obligatory since we cannot edit it's value.
     * 
     * @param {boolean} [isFieldHidden=!props.field.fieldIsHidden] - Whether or not the field is hidden.
     */
     function onChangeFieldIsHidden(isFieldHidden=!props.field.fieldIsHidden) {
        props.field.fieldIsHidden = isFieldHidden
        if (isFieldHidden === true) onChangeFieldIsRequired(false)
        onChangeField(props.field)
    }

    /**
     * Change when the field is unique or not. If the field is unique, then we can only have one value for this field. We
     * cannot have multiple values equal for this field. This means that if we try to save a record with the same already
     * existing value it will not save.
     * 
     * @param {boolean} isUnique - Whether or not the field is unique.
     */
    function onChangeFieldIsUnique(isUnique=!props.field.isUnique) {
        props.field.isUnique = isUnique
        onChangeField(props.field)
    }

    /**
     * The placeholder input opens or closes if the user checks or unchecks a given checkbox.
     * 
     * When he checks the box then we will show the input so he can start typing the placeholder, otherwise we close 
     * it.
     * 
     * When it is closing, then the placeholder will be null by default, so every value inside of it disappears.
     * 
     * @param {boolean} [placeholderIsOpen=!isPlaceholderOpen] - Whether or not the placeholder input menu is open.
     */
    function onTogglePlaceholderInput(placeholderIsOpen=!isPlaceholderOpen) {
        if (placeholderIsOpen === false) {
            props.field.placeholder = null
            onChangeField(props.field)
        }
        setIsPlaceholderOpen(placeholderIsOpen)
    }

    /** 
     * Will change effectively the value of the placeholder when he starts typing in the input.
     * 
     * @param {string} value - The value of the placeholder.
     */
    function onChangePlaceholder(value) {
        props.field.placeholder = value
        onChangeField(props.field)
    }

    /** 
     * Function called when the user clicks to rename the field. When this happens we will call a parent callback.
     * 
     * @param {boolean} [isRenaming=!isRenaming] - Whether or not the user is renaming the field.
     */
    function onToggleIsRenaming(isRenaming=!isRenaming) {
        const isOnToggleIsRenaming = typeof props.onToggleIsRenaming === 'function'
        if (isOnToggleIsRenaming) {
            props.onToggleIsRenaming(isRenaming)   
        }
        setIsRenaming(isRenaming)
    }

    useEffect(() => {
        if (APP === 'web') {
            document.addEventListener('scroll', webOnScroll, true)
        }
        return () => {
            if (APP === 'web') {
                document.removeEventListener('scroll', webOnScroll, true)
            }
        }
    }, [])

    /**
     * When the props of the `isOpen` is different from the internal component, than we will load the internal component
     * with the state of the outside component.
     */
    useEffect(() => {
        const isPropsOpenDefined = typeof props.isOpen === 'boolean'
        const isPropsOpenDifferentFromInternalState = props.isOpen !== isEditMenuOpen
        if (isPropsOpenDefined && isPropsOpenDifferentFromInternalState) {
            onToggleDropdownMenu(props.isOpen)
        }
    }, [props.isOpen])

    useEffect(() => {
        const isRenamingDefined = typeof props.isRenaming === 'boolean'
        const isExternalIsRenamingDifferentFromInternalIsRenaming = props.isRenaming !== isRenaming
        if (isRenamingDefined && isExternalIsRenamingDifferentFromInternalIsRenaming) {
            setIsRenaming(props.isRenaming)
        }
    }, [props.isRenaming])

    /**
     * This is an effect that is called whenever the `props.buttonRef` changes.
     */
    useEffect(() => {
        fieldEditMenuButtonRef.current = props.buttonRef.current
        if (APP === 'web') webLoadEditMenuTopOrDownAndDefineHeight()
    }, [props.buttonRef])

    useEffect(() => {
        if (APP === 'web') webLoadEditMenuTopOrDownAndDefineHeight()
    }, [props.customOptionForDropdownMenuProps])

    return (
        <Layout
        componentOptionForDropdownMenuRef={props.componentOptionForDropdownMenuRef}
        fieldEditMenuButtonRef={fieldEditMenuButtonRef}
        fieldEditDropdownMenuRef={fieldEditDropdownMenuRef}
        isPlaceholderOpen={isPlaceholderOpen}
        isEditMenuOpen={isEditMenuOpen}
        editMenuPosition={editMenuPosition}
        onToggleEditFieldMenu={onToggleEditFieldMenu}
        onDuplicateField={props.onDuplicateField}
        onRemoveField={props.onRemoveField}
        getTypesById={getTypesById}
        field={props.field}
        isRenaming={isRenaming}
        onToggleIsRenaming={onToggleIsRenaming}
        customOptionForDropdownMenuProps={props.customOptionForDropdownMenuProps}
        onChangeFieldIsRequired={onChangeFieldIsRequired}
        onChangeLabelIsHidden={onChangeLabelIsHidden}
        onChangeFieldIsHidden={onChangeFieldIsHidden}
        onChangeFieldIsUnique={onChangeFieldIsUnique}
        onTogglePlaceholderInput={onTogglePlaceholderInput}
        onChangePlaceholder={onChangePlaceholder}
        />
    )
}