import { useState, useEffect, useRef, useContext } from 'react'
import { WorkspaceContext } from '../../../authentication/contexts'
import { generateUUID } from '../../../../../shared/utils'
import { useClickedOrPressedOutside, colors } from '../../../core'
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

    useClickedOrPressedOutside({ ref: editMenuContainerRef, callback: () => {
        setIsHovering(false)
        setIsEditing(false)
    }})
    useClickedOrPressedOutside({ ref: renameOptionInputRef, callback: () => {
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
function OptionFormatOption(props) {
    const [isDropdown, setIsDropdown] = useState(props.isDropdown)
    
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
    const { state: { selectedWorkspace: { isAdmin: isUserAnAdmin } } } = useContext(WorkspaceContext)

    const [options, setOptions] = useState(getSelectOptions())
    const [isOpen, setIsOpen] = useState(false)

    /**
     * This will create a new option field data, this is the data needed in order to configure the `option` field type.
     * 
     * @param {object} optionFieldData - The params for the option field type.
     * @param {string} [optionFieldData.isDropdown=true] - Will we load the options as a dropdown or as a list with radio
     * buttons?
     */
    function createOptionFieldData({
        isDropdown=true
    }={}) {
        return {
            uuid: generateUUID(),
            isDropdown
        }
    }

    /**
     * If the field is not an option, or at least it has just been changed to an option, then we need to create the
     * option field data. This data will be used to configure the `option` field type with custom data.
     */
    function onDefaultCreateOptionOptionsIfDoesNotExist() {
        if (props.field.optionField === null) {
            props.field.optionField = createOptionFieldData()
            props.onUpdateFormulary()
        }
    }

    /**
     * This will get the options array to send to the `Select` component. By default we obligatorily need to set
     * `label` and `value`. But we also send some other props like the color of the option, the index, if the item
     * is the last index and so on.
     * 
     * @returns {Array<{
     *      label: string, 
     *      value: string,
     *      color: string | null,
     *      index: number,
     *      isLast: boolean,
     *      optionComponent: string, 
     *      selectedComponent: string
     * }>} - Returns an array of options to send to the `Select` component.
     */
    function getSelectOptions() {
        return props.field.options.map((option, index) => ({ 
            value: option.uuid, 
            label: option.value,
            color: option.color,
            index: index,
            isLast: index === props.field.options.length - 1,
            optionComponent: 'customOption',
            selectedComponent: 'customSelectedOption'
        }))
    }

    /**
     * This function will be called everytime we change the text label of the field/option.
     * 
     * @param {number} optionIndex - The index of the option that we are changing the name for.
     * @param {string} newValue - The new value of the option.
     */
    function onRenameOption(optionIndex, newValue) {
        if (props.field.options[optionIndex] !== undefined) {
            props.field.options[optionIndex].value = newValue
            setOptions(getSelectOptions())
            props.onUpdateFormulary()
        }
    }

    /**
     * Function used for changing the option color, by default the color is `null` this means it is transparent or 
     * in other words, it has no color.
     * 
     * @param {string} optionUUID - The uuid of the option that we want to change the color for.
     * @param {string} color - The new color of the option.
     */
    function onChangeOptionColor(optionUUID, color) {
        const optionIndex = props.field.options.findIndex(option => option.uuid === optionUUID)
        if (optionIndex !== -1) {
            props.field.options[optionIndex].color = color
            setOptions(getSelectOptions())
            props.onUpdateFormulary()
        }
    } 

    /**
     * Function used on each option in the selection when we want to move it up. This means that the option will
     * subtract one index from the array.
     * 
     * @param {number} optionUUID - The uuid of the option that you want to move one position up.
     */
    function onMoveOptionUp(optionUUID) {
        const optionIndex = props.field.options.findIndex(option => option.uuid === optionUUID)

        if (optionIndex !== -1 && optionIndex > 0) {
            const newIndex = optionIndex - 1
            const optionToSwap = props.field.options[optionIndex]
            props.field.options[optionIndex] = props.field.options[newIndex]
            props.field.options[newIndex] = optionToSwap
            setOptions(getSelectOptions())
            props.onUpdateFormulary()
        }
    }

    /**
     * Function used on each option in the selection menu for when we want to move it down. This means the option
     * will add one index from the array. Obviously we cannot move the option that is at the bottom.
     * 
     * @param {number} optionUUID - The uuid of the option that you want to move one position down.
     */
    function onMoveOptionDown(optionUUID) {
        const optionIndex = props.field.options.findIndex(option => option.uuid === optionUUID)
    
        if (optionIndex !== -1 && optionIndex < props.field.options.length - 1) {
            const newIndex = optionIndex + 1
            const optionToSwap = props.field.options[optionIndex]
            props.field.options[optionIndex] = props.field.options[newIndex]
            props.field.options[newIndex] = optionToSwap
            setOptions(getSelectOptions())
            props.onUpdateFormulary()
        }
    }

    /**
     * This will create a new option value and we add it to the field options array.
     * 
     * After we do this we update the formulary with the newly added option.
     * 
     * @param {string} optionValue - The value of the option that we want to add.
     * @param {string} color - The color of the option that we want to add. We generate it automatically.
     * See `retrieveUniqueCustomColor` for reference.
     */
    function onCreateOption(optionValue, color) {
        props.field.options.push({
            uuid: generateUUID(),
            value: optionValue,
            color: color
        })
        setOptions(getSelectOptions())
        props.onUpdateFormulary()
    }

    /**
     * Function for removing an existing option from the options array. 
     * 
     * @param {string} optionUUID - The uuid of the option that we want to remove.
     */
    function onRemoveOption(optionUUID) {
        props.field.options = props.field.options.filter(option => option.uuid !== optionUUID)
        setOptions(getSelectOptions())
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

    /**
     * This will change if the option field type will be a dropdown or not. By default every option field type 
     * is a dropdown, in other words, it hides the options inside of inputs. But we can change this behavior and 
     * load all of the options that the user can select. So we will display simple radio buttons instead of the dropdown/select
     * input.
     * 
     * @param {boolean} isDropdown - If the option field type will be a dropdown then it's true, otherwise it's false.
     */
    function onChangeIfIsDropdownMenu(isDropdown) {
        props.field.optionField.isDropdown = isDropdown
        props.onUpdateFormulary()
    }

    function onSelectOption(newOption) {
        console.log(newOption)
    }

    /**
     * Automatically retrieve a random color that the option that the user will create, will have.
     * This means that by default we will always add a unique color to the options that are created.
     * Besides that, we have a limited number of colors that we can use inside of the application that were
     * defined by our designers. So what we do is that when we have reached the limit of colors, we will get 
     * the colors that will be used less times (so this means suppose color red was used for two options but color
     * green and blue was used for one option, this means that blue and green are available to be selected again)
     * and then select a random color of the available colors we can select (on the example, green and blue).
     * 
     * @returns {string} - The color that we will use for the option that the user will create.
     */
    function retrieveUniqueCustomColor() {
        const numberOfTimesColorsWereUsed = {}
        for (const option of options) {
            if (colors.includes(option.color)) {
                const existingNumberOfTimeColorWasUsed = numberOfTimesColorsWereUsed[option.color]
                numberOfTimesColorsWereUsed[option.color] = existingNumberOfTimeColorWasUsed !== undefined ? 
                    existingNumberOfTimeColorWasUsed + 1 : 1
            }
        }

        const uniqueUsedColors = [...new Set(Object.keys(numberOfTimesColorsWereUsed))]
        
        if (uniqueUsedColors.length < colors.length) {
            const unusedColors = []
            for (const color of colors) {
                if (!uniqueUsedColors.includes(color)) {
                    unusedColors.push(color)
                }
            }
            return unusedColors[Math.floor(Math.random() * unusedColors.length)]
        } else {
            const valueThatWasUsedLeastAmountOfTimes = Math.min(...Object.values(numberOfTimesColorsWereUsed))
            const colorsThatWasUsedLeastAmountOfTimes = Object.keys(numberOfTimesColorsWereUsed).filter(color => 
                numberOfTimesColorsWereUsed[color] === valueThatWasUsedLeastAmountOfTimes
            )
            return colorsThatWasUsedLeastAmountOfTimes[Math.floor(Math.random() * colorsThatWasUsedLeastAmountOfTimes.length)]
        }
    }

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

    useEffect(() => {
        onDefaultCreateOptionOptionsIfDoesNotExist()
    }, [])

    /**
     * This will change the state of the custom options in the field menu. This way we can update the state in this component when we change something here.
     * For example the `isDropdown` state will be changed when the user toggles between the switch in the field menu.
     */
    useEffect(() => {
        props.addComponentForFieldSpecificOptionsForDropdownMenu(OptionFormatOption, {
            isDropdown: typeof props.field?.optionField?.isDropdown === 'boolean' ? props.field.optionField.isDropdown : true,
            onChangeIfIsDropdownMenu
        })
    }, [props.field?.optionField?.isDropdown])

    useEffect(() => {
        if (JSON.stringify(options) !== JSON.stringify(props.field.options)) {
            setOptions(getSelectOptions())
        }
    }, [props.field.options])
    
    return (
        <Layout.Field
        customOptionComponentProps={customOptionComponentProps}
        customOptionComponent={{ customOption: CustomOptionSelect }}
        customSelectedComponent={{ customSelectedOption: CustomSelectedOption }}
        customCreateOptionComponent={CustomCreateOptionButton}
        onCreateOption={onCreateOption}
        onSelectOption={onSelectOption}
        isOpen={isOpen}
        onOpenSelect={onOpenSelect}
        options={options}
        isUserAnAdmin={isUserAnAdmin}
        types={props.types}
        field={props.field}
        />
    )
}
