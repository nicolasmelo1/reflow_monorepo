import { useState, useEffect, useRef } from 'react'
import { generateUUID } from '../../../../../shared/utils'
import { useClickedOrPressedOutside } from '../../../core'
import Layouts from './layouts'

/**
 * This is a custom component for be rendered inside of the `Select` component when the user searches for a value
 * that does not exist in the options list.
 * 
 * When he does that, the `Select` component will render this component instead of the default component created in 
 * the `Select`. With this we can edit the layout of the component and add some custom logic if needed.
 * 
 * @param {object} props - The props it recieves from the `Select` component.
 * @param {() => void} props.onCreateOption - The function that will be called when the user clicks on the `create` button.
 * This is used for creating a new option in the select.
 * @param {string} props.search - The value of the option that the user wants to create.
 * 
 * @return {import('react').ReactElement} - The component that will be rendered.
 */
function CustomCreateOptionButton(props) {
    return process.env['APP'] === 'web' ? (
        <Layouts.Web.CustomCreateOptionButton
        value={props.search}
        onCreateOption={props.onCreateOption}
        />
    ) : (
        <Layouts.Mobile.CustomCreateOptionButton/>
    )
}

/**
 * This is a custom component that will be used to render the options in the select.
 * 
 * So instead of the default `òption` component existing in the `Select` component we will render this instead.
 * With this we can add custom hover behaviour for each select item as well as a custom layout.
 * 
 * This is EACH option in the options container that opens below or above the select input.
 * 
 * @param {object} props - The props it recieves from the `Select` component.
 * @param {{
 *      label: string, 
 *      value: string,
 *      index: number,
 *      optionComponent: string, 
 *      selectedComponent: string
 * }} props.option  - The option object that will be rendered in this button.
 * @param {(option: { label: string, value: string | number }) => void} props.onSelectOrRemoveOption - 
 * The function that will be called when the user clicks on the option.
 * @param {(optionUUID: string) => void} props.onRemoveOption - The function that will be called when the user 
 * clicks on the button to remove the option
 * @param {(optionIndex: number) => void} props.onMoveOptionUp - The function that will be called when the user
 * wants to move the option one index up.
 * @param {(optionIndex: number) => void} props.onMoveOptionDown - The function that will be called when the wants
 * to move the option one index down.
 * 
 * @return {import('react').ReactElement} - The component that will be rendered.
 */
function CustomOptionSelect(props) {
    const editOptionButtonRef = useRef()
    const editMenuContainerRef = useRef()
    const [editMenuPosition, setEditMenuPosition] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [isHovering, setIsHovering] = useState(false)
    useClickedOrPressedOutside({ ref: editMenuContainerRef, callback: () => {
        setIsHovering(false)
        setIsEditing(false)
    }})

    /**
     * Function called when the user hovers over the option. This will display custom buttons on the option
     * when he hovers so he can edit the option.
     * 
     * @param {boolean} [isHoveringOption=!isHovering] - The new value of the `isHovering` state.
     */
    function onHoverOption(isHoveringOption=!isHovering) {
        if (isEditing === true && isHoveringOption === false) return
        setIsHovering(isHoveringOption)
    } 

    function onToggleEditing(isEditingOption=!isEditing) {
        setIsEditing(isEditingOption)
        setTimeout(() => {
            if (isEditingOption === true && editMenuContainerRef.current && editOptionButtonRef.current) {
                const editMenuContainerRect = editMenuContainerRef.current.getBoundingClientRect()
                const editOptionButtonRect = editOptionButtonRef.current.getBoundingClientRect()
                const bottomOfOptionButton = editOptionButtonRect.height + editOptionButtonRect.y
                const hasSpaceOnTheBottom = bottomOfOptionButton + editMenuContainerRect.height < window.innerHeight
                
                let xPosition = editOptionButtonRect.x - (editMenuContainerRect.width / 2)
                if (xPosition + editMenuContainerRect.width > window.innerWidth) {
                    xPosition = xPosition - ((xPosition + editMenuContainerRect.width) - window.window.innerWidth)
                }   

                if (hasSpaceOnTheBottom) {
                    const position = {
                        x: xPosition,
                        y: bottomOfOptionButton
                    }
                    setEditMenuPosition(position)
                } else {
                    const position = {
                        x: xPosition,
                        y: editOptionButtonRect.y - editMenuContainerRect.height
                    }
                    setEditMenuPosition(position)
                }
            }
        }, 1)
    }

    return process.env['APP'] === 'web' ? (
        <Layouts.Web.CustomOptionSelect
        editOptionButtonRef={editOptionButtonRef}
        editMenuContainerRef={editMenuContainerRef}
        isHovering={isHovering}
        onHoverOption={onHoverOption}
        isEditing={isEditing}
        editMenuPosition={editMenuPosition}
        onToggleEditing={onToggleEditing}
        onRemoveOption={props.onRemoveOption}
        onMoveOptionUp={props.onMoveOptionUp}
        onMoveOptionDown={props.onMoveOptionDown}
        option={props.option}
        onSelectOrRemoveOption={props.onSelectOrRemoveOption}
        />
    ) : (
        <Layouts.Mobile.CustomOptionSelect/>
    )
}

export default function FormularyFieldOption(props) {
    const customOptionComponent = {
        customOption: CustomOptionSelect
    }

    const [options, setOptions] = useState(getSelectOptions())
    const [isOpen, setIsOpen] = useState(false)

    function getSelectOptions() {
        return props.field.options.map((option, index) => ({ 
            value: option.uuid, 
            label: option.value,
            index: index,
            optionComponent: 'customOption'
        }))
    }

    /**
     * Function used on each option in the selection when we want to move it up. This means that the option will
     * subtract one index from the array.
     * 
     * @param {number} optionIndex - The index of the option that you want to move one position up.
     */
    function onMoveOptionUp(optionIndex) {
        if (props.field.options[optionIndex] !== undefined) {
            const newIndex = optionIndex - 1
            const optionToSwap = props.field.options[optionIndex]
            props.field.options[optionIndex] = props.field.options[newIndex]
            props.field.options[newIndex] = optionToSwap
            setOptions([...getSelectOptions()])
            props.onUpdateFormulary()
        }
    }

    /**
     * Function used on each option in the selection menu for when we want to move it down. This means the option
     * will add one index from the array. Obviously we cannot move the option that is at the bottom.
     * 
     * @param {number} optionIndex - The index of the option that you want to move one position down.
     */
    function onMoveOptionDown(optionIndex) {        
        if (props.field.options[optionIndex] !== undefined) {
            const newIndex = optionIndex + 1
            const optionToSwap = props.field.options[optionIndex]
            props.field.options[optionIndex] = props.field.options[newIndex]
            props.field.options[newIndex] = optionToSwap
            setOptions([...getSelectOptions()])
            props.onUpdateFormulary()
        }
    }

    /**
     * This will create a new option value and we add it to the field options array.
     * 
     * After we do this we update the formulary with the newly added option.
     * 
     * @param {string} optionValue - The value of the option that we want to add.
     */
    function onCreateOption(optionValue) {
        props.field.options.push({
            uuid: generateUUID(),
            value: optionValue
        })
        setOptions([...getSelectOptions()])
        props.onUpdateFormulary()
    }

    /**
     * Function for removing an existing option from the options array. 
     * 
     * @param {string} optionUUID - The uuid of the option that we want to remove.
     */
    function onRemoveOption(optionUUID) {
        props.field.options = props.field.options.filter(option => option.uuid !== optionUUID)
        setOptions([...getSelectOptions()])
        props.onUpdateFormulary()
    }

    /**
     * Function used for when we open or closes the select component. This is a callback only so we change the state here
     * instead of in the `Select` component.
     * 
     * So when `Select` wants to close the options we call this function with `false` as a parameter. Otherwise call
     * this function with `true`.
     * 
     * @param {boolean} selectIsOpen - The state of the select component. `false` for closed, `true` for open.
     */
    function onOpenSelect(selectIsOpen) {
        setIsOpen(selectIsOpen)
    }

    const customOptionComponentProps = {
        onMoveOptionUp,
        onMoveOptionDown,
        onRemoveOption
    }

    useEffect(() => {
        if (JSON.stringify(options) !== JSON.stringify(props.field.options)) {
            setOptions(getSelectOptions())
        }
    }, [props.field.options])
    
    return process.env['APP'] === 'web' ? (
        <Layouts.Web.Field
        customOptionComponentProps={customOptionComponentProps}
        customOptionComponent={customOptionComponent}
        customCreateOptionComponent={CustomCreateOptionButton}
        onCreateOption={onCreateOption}
        isOpen={isOpen}
        onOpenSelect={onOpenSelect}
        options={options}
        types={props.types}
        field={props.field}
        />
    ) : (
        <Layouts.Mobile.Field/>
    )
}
