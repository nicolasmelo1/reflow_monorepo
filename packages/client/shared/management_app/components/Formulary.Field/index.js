import { useRef, useContext, useState, useEffect } from 'react'
import { AppManagementTypesContext } from '../../contexts'
import { useClickedOrPressedOutside } from '../../../core/hooks'
import { APP } from '../../../conf'
import Layout from './layouts'

export default function FormularyField(props) {
    const fieldTypeNameCacheRef = useRef()
    const fieldRef = useRef()
    const fieldEditMenuButtonRef = useRef()
    const fieldEditDropdownMenuRef = useRef()
    const optionForDropdownMenuRef = useRef()
    const isHoveringRef = useRef(false)
    const { state: { types } } = useContext(AppManagementTypesContext)
    const [isPlaceholderOpen, setIsPlaceholderOpen] = useState(!['', null, undefined].includes(props.field.placeholder))
    const [isHovering, _setIsHovering] = useState(isHoveringRef.current)
    const [isEditMenuOpen, setIsEditMenuOpen] = useState(false)
    const [isRenaming, setIsRenaming] = useState(false)
    const [customOptionForDropdownMenuProps, setCustomOptionForDropdownMenuProps] = useState({})
    const [editMenuPosition, setEditMenuPosition] = useState({
        position: { x: 0, y: 0 }, 
        maxHeight: null, 
        wasCalculated:false
    })
    useClickedOrPressedOutside({ ref: fieldEditDropdownMenuRef, callback: (e) => {
        if (fieldEditMenuButtonRef.current && !fieldEditMenuButtonRef.current.contains(e.target)) {
            onToggleEditFieldMenu(false)
        }
    }})

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
     * This does a bunch of calculations to determine two things: 
     * - First we define if the dropdown menu should be shown at the top or at the bottom of the button.
     * By default we always open the dropdown at the bottom, but if the dropdown menu is too big to fit on the screen
     * we will see if we can fit it at the top. (imagine we are opening the dropdown on the last field of the formulary)
     * - Second we set the maximum height of the dropdown menu. This way we will make it overflow if it is too big.
     * 
     * Okay, so how we do the calculations:
     * First we get the DOMRect data of the hole formulary container (we need it since the formulary container can overflow)
     * Then we get the DOMRect data of the field edit button menu 
     * 
     * After that we will calculate the space from the top of the screen to the bottom. And for that what we do is:
     * The height of the window minus the place where the element is located. If the dropdown is at the bottom this means
     * that the top portion will be the exact place where the element is located, if the element is located on the top, then this
     * means that what we want is the bottom position.
     * 
     * WHAT?
     * 
     * |---------------------------------|
     * |                              ...|
     * |                       |---------|| -> When we do `fieldEditDropdownRect.top` this is what we get, the exact top
     * |-----------------------|---------||
     *                         |          |
     *                         | Dropdown |
     *                         |          |
     *                         |__________|
     * 
     * If the element is positioned at the top, then:
     * 
     *                         |-----------| -> We would get this if we did `fiedEditDropdownRect.top`, that's not what we want.
     *                         |           |
     *                         | Dropdown  |
     *                         |           |
     *                         |           |
     * |----------------------------------||
     * |                       |__________|| -> IF the dropdown is positioned at the top, then we want to retrieve the `fieldEditDropdownRect.bottom`      
     * |                               ... |    because this is kinda the same position as `fieldEditDropdownRect.top` when the dropdown is positioned
     * |                                   |    at the bottom.
     * |----------------------------------||
     * 
     * Okay, so now you understand why we get the top and why we get the bottom if the dropdown menu is positioned at the top or the bottom.
     * Then we will check for the available space that we have to build the dropdown container at the top of the button, and at the bottom of the button.
     * 
     * If we have more space at the top then we will build the dropdown menu at the top, otherwise we will build it a the bottom. 
     * 
     * Important: We only change the state if the values actually change, otherwise we calculate but we don't change the state.
     */
    function webLoadEditMenuTopOrDownAndDefineHeight() {
        if (APP === 'web' && fieldEditMenuButtonRef.current && fieldEditDropdownMenuRef.current) {
            const fieldEditMenuButtonRect = fieldEditMenuButtonRef.current.getBoundingClientRect()
            const fieldEditDropdownMenuRect = fieldEditDropdownMenuRef.current.getBoundingClientRect()
            const doesDatePickerPassBottom = fieldEditMenuButtonRect.bottom + fieldEditDropdownMenuRect.height > window.innerHeight
            const doesDatePickerPassRight = fieldEditMenuButtonRect.right + fieldEditDropdownMenuRect.width > window.innerWidth
            let maxHeight = window.innerHeight - fieldEditMenuButtonRect.bottom
            let yPosition = fieldEditMenuButtonRect.bottom
            let xPosition = fieldEditMenuButtonRect.left
            if (doesDatePickerPassBottom === true) {
                // will load on top
                yPosition = fieldEditMenuButtonRect.top - fieldEditDropdownMenuRect.height
                if (yPosition < 0) yPosition = 0

                maxHeight = fieldEditMenuButtonRect.top - fieldEditMenuButtonRect.height - 5
            }
            if (doesDatePickerPassRight === true) {
                xPosition = fieldEditMenuButtonRect.right - fieldEditDropdownMenuRect.width
                if (xPosition < 0) xPosition = 0
            }

            const hasPositionChanged = editMenuPosition.wasCalculated !== true ||
                editMenuPosition.position.x !== xPosition ||
                editMenuPosition.position.y !== yPosition ||
                editMenuPosition.maxHeight !== maxHeight

            if (hasPositionChanged === true) {
                setEditMenuPosition({
                    wasCalculated: true,
                    position: { 
                        x: xPosition, 
                        y: yPosition 
                    }, 
                    maxHeight: maxHeight
                })
            }
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
     * This will open the dropdown for the user to edit the field.
     * It is a toogle so when the user clicks the first time it will open, the second time
     * it will close.
     */
    function onToggleEditFieldMenu(isOpen=!isEditMenuOpen) {
        setIsEditMenuOpen(isOpen)
        if (isOpen === false) {
            setEditMenuPosition({
                wasCalculated: false,
                position: {
                    x: 0,
                    y: 0
                },
                maxHeight: null
            })
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
        props.field.labelName = newLabelName
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

    /**
     * Retrieves the field type name from the cache if it exists or save the type name to the cache so we do
     * not need to loop everytime we want to retrieve this information.
     * 
     * This use the props directly so there is no need to pass anything to this function in order to retrieve
     * the data that you need.
     * 
     * @returns {string} - Returns the field type name of the field.
     */
    function retrieveFieldTypeName() {
        const isCacheDefined = ![null, undefined].includes(fieldTypeNameCacheRef.current)
        const fieldTypeId = props.field.fieldTypeId

        if (isCacheDefined && fieldTypeNameCacheRef.current.fieldTypeId === fieldTypeId) {
            return fieldTypeNameCacheRef.current.fieldTypeName
        } else {
            for (const fieldType of types.fieldType) {
                if (fieldType.id === fieldTypeId) {
                    fieldTypeNameCacheRef.current = {
                        fieldTypeId,
                        fieldTypeName: fieldType.name
                    }
                    return fieldType.name
                }
            }
            return ''
        }
    }

    useEffect(() => {
        if (APP === 'web') {
            window.addEventListener('resize', webLoadEditMenuTopOrDownAndDefineHeight)
            document.addEventListener('mousemove', webDismissEditFieldButton)
        }
        return () => {
            if (APP === 'web') {
                document.removeEventListener('mousemove', webDismissEditFieldButton)
                window.removeEventListener('resize', webLoadEditMenuTopOrDownAndDefineHeight)
            }
        }
    }, [])
    
    useEffect(() => {
        if (APP === 'web') webLoadEditMenuTopOrDownAndDefineHeight()
    })
    return (
        <Layout
        fieldRef={fieldRef}
        fieldEditMenuButtonRef={fieldEditMenuButtonRef}
        fieldEditDropdownMenuRef={fieldEditDropdownMenuRef}
        optionForDropdownMenuRef={optionForDropdownMenuRef}
        workspace={props.workspace}
        types={types}
        field={props.field}
        retrieveFieldTypeName={retrieveFieldTypeName}
        isHovering={isHovering}
        onToggleEditFieldMenu={onToggleEditFieldMenu}
        editMenuPosition={editMenuPosition}
        isEditMenuOpen={isEditMenuOpen}
        setIsRenaming={setIsRenaming}
        isRenaming={isRenaming}
        isPlaceholderOpen={isPlaceholderOpen}
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
