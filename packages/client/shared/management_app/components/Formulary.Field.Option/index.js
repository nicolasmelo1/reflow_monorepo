import { useState, useEffect, useRef } from 'react'
import { useClickedOrPressedOutside, colors } from '../../../core'
import { useOptionOrTagsField } from '../../hooks'
import Layout from './layouts'

// ------------------------------------------------------------------------------------------
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
    const [color, setColor] = useState(null)
    
    useEffect(() => {
        setColor(props.retrieveUniqueCustomColor())
    }, [])

    return (
        <Layout.CustomCreateOptionButton
        color={color}
        value={props.search}
        onCreateOption={props.onCreateOption}
        />
    )
}
// ------------------------------------------------------------------------------------------
/**
 * Custom component that will be rendered inside of the `Select` component when the user selects an option.
 * 
 * When the user selects an option we show an option in the menu, this option is exactly this component. We need this
 * custom selected option component in order for the user to be able to see the color of the option that he selected.
 * Also we can add further logic and functionality to this component.
 * 
 * @param {object} props - The props it recieves from the `Select` component.
 * @param {{
 *      label: string, 
 *      value: string,
 *      color: string | null,
 *      index: number,
 *      isLast: boolean,
 *      optionComponent: string, 
 *      selectedComponent: string
 * }} props.option  - The option object that will be rendered in this component.
 * @param {(option: { label: string, value: string | number }) => void} props.onSelectOrRemoveOption - 
 * The function that will be called when the user wants to remove the option.
 * 
 * @return {import('react').ReactElement} - The component that will be rendered.
 */
function CustomSelectedOption(props) {
    return (
        <Layout.CustomSelectedOption
        option={props.option}
        onSelectOrRemoveOption={props.onSelectOrRemoveOption}
        />
    )
}
// ------------------------------------------------------------------------------------------
/**
 * This is a custom component that will be used to render the options in the select.
 * 
 * So instead of the default `òption` component existing in the `Select` component we will render this instead.
 * With this we can add custom hover behaviour for each select item as well as a custom layout.
 * 
 * This is EACH option in the options container that opens below or above the select input.
 * 
 * This is not fully dependant, it has some own state, specially in the option, when the user makes some change to
 * the option we first change the internal state of this component and then we change the formulary state.
 * 
 * @param {object} props - The props it recieves from the `Select` component.
 * @param {{
 *      label: string, 
 *      value: string,
 *      color: string | null,
 *      index: number,
 *      isLast: boolean,
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
 * @param {(optionIndex: number, newValue: string) => void} props.onRenameOption - Function called while the user
 * is renaming the option.
 * @param {(optionIndex: number, color: string) => void} props.onChangeOptionColor - Function called when the user
 * changes the color of the option.
 * @param {boolean} [props.isADropdownMenu=true] - If this is true, the option will be rendered inside of the `Select`
 * component. Otherwise it will NOT be rendered inside of the `Select` component, we will display all of the options directly
 * in the field, so because of that there will be some changes needed to be done to this component. In other words, when this is false
 * each component will be a simple radio input of a formulary field.
 * @param {boolean} [props.isSelected=false] - Only needed when `props.isADropdownMenu=false`. THis will define if the option was
 * selected or not.
 * 
 * @return {import('react').ReactElement} - The component that will be rendered.
 */
function CustomOptionSelect(props) {
    const isADropdownMenu = typeof props.isADropdownMenu === 'boolean' ? props.isADropdownMenu : true
    const isSelected = typeof props.isSelected === 'boolean' ? props.isSelected : false

    const renameOptionInputRef = useRef()
    const editOptionButtonRef = useRef()
    const editMenuContainerRef = useRef()
    const [editMenuPosition, setEditMenuPosition] = useState(null)
    const [isRenaming, setIsRenaming] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [isHovering, setIsHovering] = useState(false)
    const [option, setOption] = useState(props.option)

    useClickedOrPressedOutside({ customRef: editMenuContainerRef, callback: () => {
        setIsHovering(false)
        setIsEditing(false)
    }})
    useClickedOrPressedOutside({ customRef: renameOptionInputRef, callback: () => {
        onToggleRenaming(false)
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

    /**
     * Function called when the user clicks on a color so we change the color of the option to a new color.
     * This reflects to the kanban and other places of the application.
     * 
     * When a color is selected we set the hovering to false and dismiss the edit menu. After all that we call the
     * parent `onChangeOptionColor` callback function to update the option in the formulary.
     * 
     * @param {string} color - The new color of the option.
     */
    function onChangeOptionColor(color) {
        setOption({ ...option, color })
        setIsHovering(false)
        setIsEditing(false)
        props.onChangeOptionColor(option.value, color)
    }
    
    /**
     * Function called to rename the value of the option. It is called when the user changes the value of the input.
     * After changing the local state we change the option name inside of the formulary.
     * 
     * @param {string} newLabel - The new value string of the option.
     */
    function onChangeOptionLabel(newLabel) {
        option.label = newLabel
        setOption({...option})
        props.onRenameOption(option.index, newLabel)
    }

    /**
     * This will handle when the user clicks on the edit button or when he closes the edit menu.
     * 
     * When the user clicks the edit menu, what we do is that we need to set the position of the menu up or down of the button that was clicked.
     * This function is REALLY similar to `onOpenMenu` in `useDropdownMenuSelect` hook. Except that this will render the button up or down of the button
     * that was clicked. The hook will handle if the menu opens on the left or the right.
     * 
     * @param {boolean} [isEditingOption=!isEditing] - The new value of the `isEditing` state. If `false` then the menu will be closed, 
     * if true then the menu will open.
     */
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

    /**
     * When this function is called we change the state of the `isRenaming` state.
     * 
     * This will change, instead of showing a simple text in the option, we will show an input so he can start typing
     * the new value for the option.
     * 
     * Be aware, everytime we open the `input` we dismiss the edit menu.
     * 
     * @param {boolean} [isRenamingOption=!isRenaming] - The new value of the `isRenaming` state. If `false` then we will show
     * a simple text in the option, otherwise we will show an input so he can start typing the new value for the option.
     */
    function onToggleRenaming(isRenamingOption=!isRenaming) {
        onToggleEditing(false)
        setIsRenaming(isRenamingOption)
    }

    /**
     * Although this is not exactly independant, it has some independant things, like storing the option in the internal state.
     * This means that when the `props.option` changes and the internal state is different from the state recieved from the
     * parent component, we change the internal state to the new state.
     */
    useEffect(() => {
        if (JSON.stringify(props.option) !== JSON.stringify(option)) {
            setOption(props.option)
        }
    }, [props.option])

    return (
        <Layout.CustomOptionSelect
        renameOptionInputRef={renameOptionInputRef}
        editOptionButtonRef={editOptionButtonRef}
        editMenuContainerRef={editMenuContainerRef}
        isADropdownMenu={isADropdownMenu}
        isSelected={isSelected}
        isHovering={isHovering}
        onHoverOption={onHoverOption}
        isEditing={isEditing}
        isRenaming={isRenaming}
        isUserAnAdmin={props.isUserAnAdmin}
        editMenuPosition={editMenuPosition}
        onToggleEditing={onToggleEditing}
        onToggleRenaming={onToggleRenaming}
        onChangeOptionColor={onChangeOptionColor}
        onChangeOptionLabel={onChangeOptionLabel}
        onRemoveOption={props.onRemoveOption}
        onMoveOptionUp={props.onMoveOptionUp}
        onMoveOptionDown={props.onMoveOptionDown}
        option={option}
        field={props.field}
        onSelectOrRemoveOption={props.onSelectOrRemoveOption}
        />
    )
}
// ------------------------------------------------------------------------------------------
/**
 * This component is the option component of the dropdown menu of the field. This will add custom configurations for
 * the `option` field type. With this the user can set if he wants the option to be a select component or a simple
 * radio button.
 * 
 * @param {object} props - The props of the component.
 * @param {boolean} props.isDropdown - If the option field is a dropdown or not.
 * @param {(isDropdown: boolean) => void} props.onChangeIfIsDropdownMenu - Callback function used to change if the option is
 * a dropdown or not.
 * 
 * @return {import('react').ReactElement}
 */
export function OptionFormatOption(props) {
    const [isDropdown, setIsDropdown] = useState(props.isDropdown)
    
    /**
     * Changes if the option is a dropdown menu or not. A dropdown menu means that all of the options will be
     * inside of a select. When it is not a dropdown menu, it is simple radio buttons.
     * 
     * @param {boolean} isDropdownMenu - If it is a dropdown menu it will be true, otherwise, false.
     */
    function onChangeIfIsDropdownMenu(isDropdownMenu=!isDropdown) {
        setIsDropdown(isDropdownMenu)
        props.onChangeIfIsDropdownMenu(isDropdownMenu)
    }

    return <Layout.DropdownMenu
    isDropdown={isDropdown}
    onChangeIfIsDropdownMenu={onChangeIfIsDropdownMenu}
    />
}
// ------------------------------------------------------------------------------------------
export default function FormularyFieldOption(props) {
    const {
        onCreateOption,
        onSelectOption,
        isOpen,
        onOpenSelect,
        options,
        isUserAnAdmin,
        onMoveOptionUp,
        onMoveOptionDown,
        onRemoveOption,
        onRenameOption,
        onChangeOptionColor,
        retrieveUniqueCustomColor
    } = useOptionOrTagsField(
        props.field, props.onChangeField, 
        props.registerComponentForFieldSpecificOptionsForDropdownMenu, 
        props.registerOnDuplicateOfField,
        'option'
    )

    const customOptionComponentProps = {
        onMoveOptionUp,
        onMoveOptionDown,
        onRemoveOption,
        onRenameOption,
        onChangeOptionColor,
        isUserAnAdmin,
        retrieveUniqueCustomColor,
        field: props.field
    }

    return (
        <Layout.Field
        customOptionComponentProps={customOptionComponentProps}
        customOptionComponent={CustomOptionSelect}
        customSelectedComponent={CustomSelectedOption}
        customCreateOptionComponent={CustomCreateOptionButton}
        onCreateOption={onCreateOption}
        onSelectOption={onSelectOption}
        isOpen={isOpen}
        onOpenSelect={onOpenSelect}
        options={options}
        isUserAnAdmin={isUserAnAdmin}
        field={props.field}
        />
    )
}
