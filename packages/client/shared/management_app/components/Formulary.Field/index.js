import { useRef, useContext, useState, useEffect } from 'react'
import Layouts from './layouts'
import { AppManagementTypesContext } from '../../contexts'


export default function FormularyField(props) {
    const fieldTypeNameCacheRef = useRef()
    const fieldEditDropdownMenuRef = useRef()
    const optionsForDropdownMenuRef = useRef([])
    const { state: { types } } = useContext(AppManagementTypesContext)
    const [isPlaceholderOpen, setIsPlaceholderOpen] = useState(!['', null, undefined].includes(props.field.placeholder))
    const [isHovering, setIsHovering] = useState(false)
    const [isEditMenuOpen, setIsEditMenuOpen] = useState(false)
    const [isRenaming, setIsRenaming] = useState(false)
    const [editMenuMaximumHeight, setEditMenuMaximumHeight] = useState(undefined)
    const [isEditMenuAtBottom, setIsEditMenuAtBottom] = useState(true)

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
     *          props.addComponentsForFieldSpecificOptionsForDropdownMenu([
     *              <DefaultValueInput
     *              key={`custominput-${props.field.uuid}`}
     *              value={defaultValue}
     *              onChange={onChangeDefaultValueInCustomOption}
     *              />
     *         ])
     *      }, [])
     * 
     *      return process.env['APP'] === 'web' ? (
     *          <Layouts.Web types={props.types} field={props.field} />
     *      ) : (
     *          <Layouts.Mobile/>
     *      )
     * }
     * ```
     * 
     * So in this example let's look for some things: 
     * FormularyFieldText has a useEffect function without any dependencies, this means that it will be called only once when
     * this component mounts, this is obligatory, you don't want to rerender the option every time `FormularyFieldText` is
     * rerendered.
     * 
     * Also be aware that this function adds the components to a ref, this means it will NOT rerender the component again when
     * we call `props.addComponentsForFieldSpecificOptionsForDropdownMenu` again. All of the changes that you make when you call
     * this function again will be added on the next time we reopen the dropdown menu.
     * 
     * Last but not least, because of this ^, we need to make sure our component holds all of the state it needs. 
     * This line
     * `const [defaultValue, setDefaultValue] = useState(props.value)`
     * 
     * is defined in the `DefaultValueInput` component AND NOT on the `FormularyFieldText` component. This means that `DefaultValueInput`
     * holds the state it needs, and updates through a callback the state on the `FormularyFieldText` component. 
     * 
     * What this means is that the `DefaultValueInput` is the single source of truth for the state, and we keep it in sync with
     * the `FormularyFieldText` through callbacks.
     */
    function addComponentsForFieldSpecificOptionsForDropdownMenu(components) {
        optionsForDropdownMenuRef.current = components
    }

    /**
     * / * WEB ONLY * /
     * 
     * This is a web only function that is used to show a menu button when the user hovers over the field.
     * This way admins can edit the field.
     * 
     * @param {boolean} isUserHoveringField - Whether or not the user is hovering over the field.
     */
    function onHoverFieldWeb(isUserHoveringField) {
        if (isUserHoveringField === false) {
            setIsHovering(isUserHoveringField)
            setIsEditMenuOpen(false)
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
     * Last but not least we give it a little bit of extra space so it's nicely formated and looks nice on the screen, that's why we sum
     * to 60px if we position at the bottom and subtract 40px if we position at the top (actually at the top it's more then just format niely, but
     * the element gets cut because of the overflow.)
     */
    function loadEditMenuTopOrDownAndDefineHeight() {
        if (fieldEditDropdownMenuRef.current && props.formularyContainerRef.current) {
            const formularyContainerRect = props.formularyContainerRef.current.getBoundingClientRect()
            const fieldEditDropdownRect = fieldEditDropdownMenuRef.current.getBoundingClientRect()
            const spaceAtBottom = window.innerHeight - (isEditMenuAtBottom ? fieldEditDropdownRect.top : fieldEditDropdownRect.bottom + 20)
            const spaceAtTop = window.innerHeight - spaceAtBottom - formularyContainerRect.top
            const hasMoreSpaceAtBottom = spaceAtBottom > spaceAtTop
            if (hasMoreSpaceAtBottom) {
                const fieldEditDropdownOverflowToBottom = (isEditMenuAtBottom ? fieldEditDropdownRect.top : fieldEditDropdownRect.bottom) +
                    fieldEditDropdownMenuRef.current.scrollHeight - window.innerHeight + 60
                if (fieldEditDropdownOverflowToBottom > 0) {
                    const maximumHeight = fieldEditDropdownMenuRef.current.scrollHeight - fieldEditDropdownOverflowToBottom
                    setEditMenuMaximumHeight(maximumHeight) 
                } else {
                    setEditMenuMaximumHeight(undefined)
                }
                setIsEditMenuAtBottom(true)
            } else {
                const fieldEditDropdownOverflowToTop = spaceAtTop - fieldEditDropdownMenuRef.current.scrollHeight - 40
                if (fieldEditDropdownOverflowToTop < 0) {
                    // This is basic maths but - with - is +, so - ( - 1 ) is + 1
                    const maximumHeight = fieldEditDropdownMenuRef.current.scrollHeight - ( - fieldEditDropdownOverflowToTop)
                    setEditMenuMaximumHeight(maximumHeight)
                } else {
                    setEditMenuMaximumHeight(undefined)
                }
                setIsEditMenuAtBottom(false)
            }
        }
    }

    /**
     * This will open the dropdown for the user to edit the field.
     * It is a toogle so when the user clicks the first time it will open, the second time
     * it will close.
     */
    function onToggleEditFieldMenu() {
        setIsEditMenuOpen(!isEditMenuOpen)
        setTimeout(() => {
            loadEditMenuTopOrDownAndDefineHeight()
        }, 1)
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
        if (props.field.labelIsHidden === true) onChangeFieldIsRequired(false)
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

    function onTogglePlaceholderInput() {
        const nextState = !isPlaceholderOpen
        if (nextState === false) {
            props.field.placeholder = null
            props.onUpdateFormulary()
        }
        setIsPlaceholderOpen(!isPlaceholderOpen)
    }

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
        if (process.env['APP'] === 'web') window.addEventListener('resize', loadEditMenuTopOrDownAndDefineHeight)
        return () => {
            if (process.env['APP'] === 'web') window.removeEventListener('resize', loadEditMenuTopOrDownAndDefineHeight)
        }
    }, [])
        
    return process.env['APP'] === 'web' ? (
        <Layouts.Web
        fieldEditDropdownMenuRef={fieldEditDropdownMenuRef}
        optionsForDropdownMenuRef={optionsForDropdownMenuRef}
        types={types}
        field={props.field}
        retrieveFieldTypeName={retrieveFieldTypeName}
        onHoverFieldWeb={onHoverFieldWeb}
        isHovering={isHovering}
        onToggleEditFieldMenu={onToggleEditFieldMenu}
        editMenuMaximumHeight={editMenuMaximumHeight}
        isEditMenuAtBottom={isEditMenuAtBottom}
        isEditMenuOpen={isEditMenuOpen}
        setIsRenaming={setIsRenaming}
        isRenaming={isRenaming}
        isPlaceholderOpen={isPlaceholderOpen}
        addComponentsForFieldSpecificOptionsForDropdownMenu={addComponentsForFieldSpecificOptionsForDropdownMenu}
        onChangeFieldLabelName={onChangeFieldLabelName}
        onChangeFieldIsRequired={onChangeFieldIsRequired}
        onChangeLabelIsHidden={onChangeLabelIsHidden}
        onChangeFieldIsHidden={onChangeFieldIsHidden}
        onChangeFieldIsUnique={onChangeFieldIsUnique}
        onChangePlaceholder={onChangePlaceholder}
        onTogglePlaceholderInput={onTogglePlaceholderInput}
        onRemoveField={props.onRemoveField}
        onDuplicateField={props.onDuplicateField}
        />
    ) : (
        <Layouts.Mobile/>
    )
}