import { useRef, useContext, useState, useEffect } from 'react'
import { AppManagementTypesContext } from '../../contexts'
import { WorkspaceContext } from '../../../authentication/contexts'
import { useClickedOrPressedOutside, useOpenFloatingDropdown } from '../../../core/hooks'
import { APP } from '../../../conf'
import Layout from './layouts'
import { useFieldTypes } from '../../hooks'

export default function FormularyField(props) {
    const fieldRef = useRef()
    const optionForDropdownMenuRef = useRef()
    const isHoveringRef = useRef(false)
    const isNewField = typeof props.isNewField === 'boolean' ? props.isNewField : false
    
    const { state: { selectedWorkspace }} = useContext(WorkspaceContext)
    const { state: { types } } = useContext(AppManagementTypesContext)
    const [isPlaceholderOpen, setIsPlaceholderOpen] = useState(!['', null, undefined].includes(props.field.placeholder))
    const [isHovering, _setIsHovering] = useState(isHoveringRef.current)
    const [isRenaming, setIsRenaming] = useState(isNewField)
    const [customOptionForDropdownMenuProps, setCustomOptionForDropdownMenuProps] = useState({})
    const {
        dropdownButtonRef: fieldEditMenuButtonRef,
        dropdownMenuRef: fieldEditDropdownMenuRef,
        webLoadDropdownMenuTopOrDownAndDefineHeight: webLoadEditMenuTopOrDownAndDefineHeight,
        isDropdownOpen: isEditMenuOpen,
        dropdownMenuPosition: editMenuPosition,
        onToggleDropdownMenu: onToggleEditFieldMenu
    } = useOpenFloatingDropdown({isOpen: isNewField})
    const { 
        getTypesById
    } = useFieldTypes(types)
    useClickedOrPressedOutside({ 
        customRef: fieldEditDropdownMenuRef, 
        callback: (e) => {
            if (fieldEditMenuButtonRef.current && !fieldEditMenuButtonRef.current.contains(e.target)) {
                onToggleEditFieldMenu(false)
            }
        }
    })

    function setIsHovering(isUserHoveringOnField=!isHovering) {
        isHoveringRef.current = isUserHoveringOnField
        _setIsHovering(isUserHoveringOnField)
    }

    /**
     * This will add components to the dropdown menu so the user can edit it.
     * 
     * This data that the field needs comes from the component of the field type. 
     * 
     * What this means in other words is, suppose that for `number` fieldType we need to add the checkbox
     * if we allow negative numbers to this input and the checkbox to be checked if we allow numbers to be 0.
     * This means we need two extra switches in the dropdown menu to edit the field.
     * 
     * For that we would need to know here what the options are for the `number` fieldType.
     * 
     * We would need to define it for each fieldType here directly. But we can be more efficient and divide this responsability.
     * In the `Formulary.Field.Number` component we can define the options that can exist in the dropdown. And then append it using 
     * this function.
     * 
     * For example:
     * 
     * ```
     * function DefaultValueInput(props) {
     *      const [defaultValue, setDefaultValue] = useState(props.value)
     * 
     *      function onChange(value) {
     *          props.onChange(value)
     *          setDefaultValue(value)
     *      }
     * 
     *      return <input type={'text'} value={defaultValue} onChange={(e) => onChange(e.target.value)}/>
     * }
     * 
     * function FormularyFieldText(props) {
     *      function onChangeDefaultValueInCustomOption(value) {
     *          props.field.defaultValue = value
     *          props.onUpdateFormulary()
     *      }
     *      
     *      useEffect(() => {
     *          props.addComponentForFieldSpecificOptionsForDropdownMenu(
     *              DefaultValueInput,
     *              {
     *                  value: defaultValue,
     *                  onChange: onChangeDefaultValueInCustomOption
     *              }
     *         )
     *      }, [props.field.defaultValue])
     * 
     *      return APP === 'web' ? (
     *          <Layouts.Web types={props.types} field={props.field} />
     *      ) : (
     *          <Layouts.Mobile/>
     *      )
     * }
     * ```
     * 
     * So in this example let's look for some things: 
     * FormularyFieldText has a useEffect function with `props.field.defaultValue` as dependency, this means that it will be called everytime the `props.field.defaultValue` 
     * changes to a new value. So we will be able rerender the `DefaultValueInput` component even though the logic is kept completely in the `FormularyFieldNumber` component.
     *
     * Important thing to note is that we DO NOT keep track of when the `onChangeDefaultValueInCustomOption` function changes in the `useEffect` hook, that's because it's a function
     * and the only purpose of functions is to serve as a callback we do not need to rerender the component everytime the function changes.
     * 
     * @param {import('react').ReactElement} component - The component that holds all of the custom options for the field type.
     * @param {object} props - The props that the component will receive.
     */
    function addComponentForFieldSpecificOptionsForDropdownMenu(component, componentProps={}) {
        optionForDropdownMenuRef.current = component
        setCustomOptionForDropdownMenuProps(componentProps)
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
            onToggleEditFieldMenu(false)
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
     * We update the formulary by reference, so you need to understand what is passing a value by reference and by value.
     * Here:
     * https://www.google.com/url?sa=i&url=https%3A%2F%2Fstackoverflow.com%2Fquestions%2F43826922%2Fif-java-is-pass-by-value-then-why-can-we-change-the-properties-of-objects-in-me&psig=AOvVaw3Pln8znHHN39RJWWQSoaqx&ust=1642467147354000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCKC08ojJt_UCFQAAAAAdAAAAABAD
     * 
     * @param {string} newLabelName - The new label name of the field.
     */
    function onChangeFieldLabelName(newLabelName) {
        props.field.label.name = newLabelName
        props.onUpdateFormulary()
    }

    /**
     * This will change if the field is required or not. This means, the field can or cannot be empty.
     * 
     * We update the formulary by reference, so you need to understand what is passing a value by reference and by value.
     * Here:
     * https://www.google.com/url?sa=i&url=https%3A%2F%2Fstackoverflow.com%2Fquestions%2F43826922%2Fif-java-is-pass-by-value-then-why-can-we-change-the-properties-of-objects-in-me&psig=AOvVaw3Pln8znHHN39RJWWQSoaqx&ust=1642467147354000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCKC08ojJt_UCFQAAAAAdAAAAABAD
     * 
     * If we have hid the field we cannot make it obligatory since we cannot change it's value.
     * 
     * @param {boolean} isRequired - Whether or not the field is required.
     */
    function onChangeFieldIsRequired(isRequired) {
        if (props.field.fieldIsHidden === false && isRequired === true) {
            props.field.required = isRequired
            props.onUpdateFormulary()
        } else if (isRequired === false) {
            props.field.required = isRequired
            props.onUpdateFormulary()
        }
    }   

    /**
     * Change if the label of the field is visible or not. If it is then we show the name of the field at the top, otherwise
     * we do not show any label at the top.
     * 
     * @param {boolean} isLabelVisible - Whether or not the label of the field is visible.
     */
    function onChangeLabelIsHidden(isLabelHidden) {
        props.field.labelIsHidden = isLabelHidden
        props.onUpdateFormulary()
    }

    /**
     * Change wheather or not the field is visible or not. If the field is hidden we will not show the field to the user, 
     * the field is the input. Otherwise we show it to the user.
     * When we hide the field, we cannot make it obligatory since we cannot edit it's value.
     * 
     * @param {boolean} isFieldHidden - Whether or not the field is hidden.
     */
    function onChangeFieldIsHidden(isFieldHidden) {
        props.field.fieldIsHidden = isFieldHidden
        if (isFieldHidden === true) onChangeFieldIsRequired(false)
        props.onUpdateFormulary()
    }

    /**
     * Change when the field is unique or not. If the field is unique, then we can only have one value for this field. We
     * cannot have multiple values equal for this field. This means that if we try to save a record with the same already
     * existing value it will not save.
     * 
     * @param {boolean} isFieldUnique - Whether or not the field is unique.
     */
    function onChangeFieldIsUnique(isUnique) {
        props.field.isUnique = isUnique
        props.onUpdateFormulary()
    }

    /**
     * The placeholder input opens or closes if the user checks or unchecks a given checkbox.
     * 
     * When he checks the box then we will show the input so he can start typing the placeholder, otherwise we close 
     * it.
     * 
     * When it is closing, then the placeholder will be null by default, so every value inside of it disappears.
     */
    function onTogglePlaceholderInput() {
        const nextState = !isPlaceholderOpen
        if (nextState === false) {
            props.field.placeholder = null
            props.onUpdateFormulary()
        }
        setIsPlaceholderOpen(!isPlaceholderOpen)
    }

    /** 
     * Will change effectively the value of the placeholder when he starts typing in the input.
     * 
     * @param {string} value - The value of the placeholder.
     */
    function onChangePlaceholder(value) {
        props.field.placeholder = value
        props.onUpdateFormulary()
    }

    useEffect(() => {
        if (APP === 'web') {
            document.addEventListener('mousemove', webDismissEditFieldButton)
            document.addEventListener('scroll', webLoadEditMenuTopOrDownAndDefineHeight, true)
        }
        return () => {
            if (APP === 'web') {
                document.removeEventListener('mousemove', webDismissEditFieldButton)
                document.addEventListener('scroll', webLoadEditMenuTopOrDownAndDefineHeight, true)
            }
        }
    }, [])
    
    useEffect(() => {
        if (APP === 'web') webLoadEditMenuTopOrDownAndDefineHeight()
    })
    return (
        <Layout
        retrieveFieldsCallbacksRef={props.retrieveFieldsCallbacksRef}
        fieldRef={fieldRef}
        fieldEditMenuButtonRef={fieldEditMenuButtonRef}
        fieldEditDropdownMenuRef={fieldEditDropdownMenuRef}
        optionForDropdownMenuRef={optionForDropdownMenuRef}
        workspace={selectedWorkspace}
        types={types}
        field={props.field}
        retrieveFields={props.retrieveFields}
        isHovering={isHovering}
        getTypesById={getTypesById}
        onToggleEditFieldMenu={onToggleEditFieldMenu}
        editMenuPosition={editMenuPosition}
        isEditMenuOpen={isEditMenuOpen}
        setIsRenaming={setIsRenaming}
        isRenaming={isRenaming}
        isPlaceholderOpen={isPlaceholderOpen}
        isNewField={isNewField}
        addComponentForFieldSpecificOptionsForDropdownMenu={addComponentForFieldSpecificOptionsForDropdownMenu}
        customOptionForDropdownMenuProps={customOptionForDropdownMenuProps}
        onChangeFieldLabelName={onChangeFieldLabelName}
        onChangeFieldIsRequired={onChangeFieldIsRequired}
        onChangeLabelIsHidden={onChangeLabelIsHidden}
        onChangeFieldIsHidden={onChangeFieldIsHidden}
        onChangeFieldIsUnique={onChangeFieldIsUnique}
        onChangePlaceholder={onChangePlaceholder}
        onTogglePlaceholderInput={onTogglePlaceholderInput}
        onUpdateFormulary={props.onUpdateFormulary}
        onRemoveField={props.onRemoveField}
        onDuplicateField={props.onDuplicateField}
        />
    )
}
