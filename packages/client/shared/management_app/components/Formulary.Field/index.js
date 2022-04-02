import { useRef, useContext, useState, useEffect } from 'react'
import { AppManagementTypesContext } from '../../contexts'
import { WorkspaceContext } from '../../../authentication/contexts'
import { useClickedOrPressedOutside, useOpenFloatingDropdown } from '../../../core/hooks'
import { APP } from '../../../conf'
import { useFieldTypes, useFieldEdit } from '../../hooks'
import { deepCopy } from '../../../../../shared/utils'
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
 */
export function FieldEditDropdownMenu(props) {
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
        <Layout.DropdownMenu
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
// ------------------------------------------------------------------------------------------
export default function FormularyField(props) {
    const isNewField = typeof props.isNewField === 'boolean' ? props.isNewField : false

    const fieldRef = useRef()
    const isHoveringRef = useRef(isNewField)
    const fieldEditMenuButtonRef = useRef()

    const { state: { selectedWorkspace }} = useContext(WorkspaceContext)
    const { state: { types } } = useContext(AppManagementTypesContext)
    const [isFieldEditDropdownMenuOpen, setIsFieldEditDropdownMenuOpen] = useState(isNewField)
    const [isHovering, _setIsHovering] = useState(isHoveringRef.current)
    const [isRenaming, setIsRenaming] = useState(isNewField)
    const { getTypesById } = useFieldTypes(types.fieldTypes)
    const {
        registerComponentForFieldSpecificOptionsForDropdownMenu,
        componentOptionForDropdownMenuRef,
        customOptionForDropdownMenuProps
     } = useFieldEdit(props.onDuplicateField, props.onRemoveField)


    function setIsHovering(isUserHoveringOnField=!isHovering) {
        isHoveringRef.current = isUserHoveringOnField
        _setIsHovering(isUserHoveringOnField)
    }

    /**
     * / * WEB ONLY * /
     * 
     * This is a web only function that is used to show a menu button when the user hovers over the field.
     * This way admins can edit the field.
     * 
     * @param {boolean} isUserHoveringField - Whether or not the user is hovering over the field.
     */
    function webOnHoverFieldWeb(isUserHoveringField) {
        if (isUserHoveringField === false) {
            setIsHovering(isUserHoveringField)
            //onToggleEditFieldMenu(false)
        } else {
            setIsHovering(isUserHoveringField)
        }
    }
    
    /**
     * / * WEB ONLY * /
     * 
     * This is a web only function that is used to show or dismiss the menu button on the field. This way the admin
     * can easily edit and change the field settings in a dropdown menu. Also by activating this on hover we are able 
     * to progressively make the user understand the platform.
     * 
     * @param {MouseEvent} e - The mouse event that is triggered when the user hovers over the document.
     */
    function webDismissEditFieldButton(e) {
        if (fieldRef.current && fieldRef.current.contains(e.target) && isHoveringRef.current === false) {
            webOnHoverFieldWeb(true)
        } else if (fieldRef.current && !fieldRef.current.contains(e.target) && isHoveringRef.current === true) {
            webOnHoverFieldWeb(false)
        }
    }
    
    /**
     * Updates the label name of the field. When we update it we also update the hole formulary and rerender it again.
     * 
     * @param {string} newLabelName - The new label name of the field.
     */
    function onChangeFieldLabelName(newLabelName) {
        props.field.label.name = newLabelName
        onChangeFieldConfiguration(props.field, ['label', 'name'])
    }

    /**
     * This is responsible for checking if the change to the field was valid or not. In other words, this means that the changes
     * to the field are not valid, or they are. For example we cannot have a field with the same name as another field so we validate that here.
     * 
     * @param {object} newFieldData - Recieves the hole field data to check to the other fields inside of the formulary.
     */
    function areFieldChangesValid(newFieldData) {
        const allFields = props.retrieveFields()
        const labelNamesByFieldUUID = {}
        
        for (const field of allFields) {
            labelNamesByFieldUUID[field.label.name] = field.uuid
        }

        if (labelNamesByFieldUUID[newFieldData.label.name] !== undefined && labelNamesByFieldUUID[newFieldData.label.name] !== props.field.uuid) {
            return false
        }
        return true
    }

    /**
     * We update the formulary by reference, so you need to understand what is passing a value by reference and by value.
     * Here:
     * https://www.google.com/url?sa=i&url=https%3A%2F%2Fstackoverflow.com%2Fquestions%2F43826922%2Fif-java-is-pass-by-value-then-why-can-we-change-the-properties-of-objects-in-me&psig=AOvVaw3Pln8znHHN39RJWWQSoaqx&ust=1642467147354000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCKC08ojJt_UCFQAAAAAdAAAAABAD
     * 
     */
    function onChangeFieldConfiguration(newFieldData, namespaces=[]) {
        const isNamespacesDefined = namespaces.length > 0
        if (isNamespacesDefined === false) {
            for (const [key, value] of Object.entries(newFieldData)) {
                const isDifferentType = typeof props.field[key] !== typeof value
                const isDifferentValue = props.field[key] !== value
                const isDifferentStringValue = JSON.stringify(props.field[key]) !== JSON.stringify(value)
                if (isDifferentType || isDifferentValue || isDifferentStringValue) {
                    props.field[key] = value
                }
                    
                props.field[key] = value
            }
        } else {
            let objectToChangeValue = props.field
            let newObjectWithValueChanged = newFieldData
            const lastNamespace = namespaces.pop()
            for (const namespace of namespaces) {
                objectToChangeValue = objectToChangeValue[namespace]
                newObjectWithValueChanged = newObjectWithValueChanged[namespace]
            }
            objectToChangeValue[lastNamespace] = newObjectWithValueChanged[lastNamespace]
        }
        
        if (areFieldChangesValid(newFieldData) === false) {
            console.log('Inválido')
        }
        props.onUpdateFormulary()
    }

    useEffect(() => {
        if (APP === 'web') {
            document.addEventListener('mousemove', webDismissEditFieldButton)
        }
        return () => {
            if (APP === 'web') {
                document.removeEventListener('mousemove', webDismissEditFieldButton)
            }
        }
    }, [])
   
    return (
        <Layout.Field
        registerRetrieveFieldsCallback={props.registerRetrieveFieldsCallback}
        fieldRef={fieldRef}
        fieldEditMenuButtonRef={fieldEditMenuButtonRef}
        FieldEditDropdownMenu={FieldEditDropdownMenu}
        isFieldEditDropdownMenuOpen={isFieldEditDropdownMenuOpen}
        onToggleEditFieldMenu={onToggleEditFieldMenu}
        onChangeFieldConfiguration={onChangeFieldConfiguration}
        workspace={selectedWorkspace}
        types={types}
        field={props.field}
        retrieveFields={props.retrieveFields}
        isHovering={isHovering}
        getTypesById={getTypesById}
        setIsRenaming={setIsRenaming}
        isRenaming={isRenaming}
        isNewField={isNewField}
        registerOnDuplicateOfField={props.registerOnDuplicateOfField}
        registerOnDeleteOfField={props.registerOnDeleteOfField}
        registerRetrieveFieldsOfField={props.registerRetrieveFieldsOfField}
        registerComponentForFieldSpecificOptionsForDropdownMenu={registerComponentForFieldSpecificOptionsForDropdownMenu}
        componentOptionForDropdownMenuRef={componentOptionForDropdownMenuRef}
        customOptionForDropdownMenuProps={customOptionForDropdownMenuProps}
        onChangeFieldLabelName={onChangeFieldLabelName}
        onUpdateFormulary={props.onUpdateFormulary}
        onRemoveField={props.onRemoveField}
        onDuplicateField={props.onDuplicateField}
        />
    )
}
