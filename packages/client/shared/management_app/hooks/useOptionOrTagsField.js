import { useState, useEffect, useContext } from 'react'
import { generateUUID } from '../../../../shared/utils'
import { WorkspaceContext } from '../../authentication/contexts'
import { colors } from '../../core'
import { OptionFormatOption } from '../components/Formulary.Field.Option'
import { TagsFormatOption } from '../components/Formulary.Field.Tags'

/**
 * Hook used for managing the state and the actions of the option field.
 * 
 * @param {string} [optionsType='option'] - Is the field type an `option` type or a `tags` type
 */
export default function useOptionOrTagsField(
    fieldData, onChangeField, registerComponentForFieldSpecificOptionsForDropdownMenu, 
    registerOnDuplicateOfField, optionsType='option'
) {
    const { state: { selectedWorkspace: { isAdmin: isUserAnAdmin } } } = useContext(WorkspaceContext)

    const [field, setField] = useState(fieldData)
    const [options, setOptions] = useState(getSelectOptions())
    const [isOpen, setIsOpen] = useState(false)

    /**
     * This will create a new tags field data, this is the data needed in order to configure the `tags` field type.
     * 
     * @param {object} tagsFieldData - The params for the option field type.
     * @param {string} [tagsFieldData.isDropdown=true] - Will we load the options as a dropdown or as a list with radio
     * buttons?
     * @param {number | null} [tagsFieldData.maxNumberOfOptions=null] - Maximum number of options that the user can select.
     * 
     * @returns {{uuid: string, isDropdown: boolean, maxNumberOfOptions: number | null}} - The new tags field data.
     */
    function createTagsFieldData({
        isDropdown=true,
        maxNumberOfOptions=null
    }={}) {
        return {
            uuid: generateUUID(),
            isDropdown,
            maxNumberOfOptions
        }
    }

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
    function onDefaultCreateOptionOrTagsOptionsIfDoesNotExist() {
        if (optionsType === 'option') {
            const isOptionFieldDataDefined = typeof field.optionField === 'object' && ![null, undefined].includes(field.optionField)
            if (isOptionFieldDataDefined === false) {
                field.optionField = createOptionFieldData()
                onChangeField(field, ['optionField'])
            }
        } else if (optionsType === 'tags') {
            const isTagsFieldDataDefined = typeof field.tagsField === 'object' && ![null, undefined].includes(field.tagsField)
            if (isTagsFieldDataDefined === false) {
                field.tagsField = createTagsFieldData()
                onChangeField(field, ['tagsField'])
            }
        }
        setField(field)
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
        return field.options.map((option, index) => ({ 
            value: option.uuid, 
            label: option.value,
            color: option.color,
            index: index,
            isLast: index === field.options.length - 1
        }))
    }

    /**
     * This function will be called everytime we change the text label of the field/option.
     * 
     * @param {number} optionIndex - The index of the option that we are changing the name for.
     * @param {string} newValue - The new value of the option.
     */
    function onRenameOption(optionIndex, newValue) {
        const doesOptionIndexExist = field.options[optionIndex] !== undefined
        if (doesOptionIndexExist) {
            field.options[optionIndex].value = newValue
            setOptions(getSelectOptions())
            setField(field)
            onChangeField(field, ['options'])
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
        const optionIndex = field.options.findIndex(option => option.uuid === optionUUID)
        if (optionIndex !== -1) {
            field.options[optionIndex].color = color
            setOptions(getSelectOptions())
            setField(field)
            onChangeField(field, ['options'])
        }
    } 

    /**
     * Function used on each option in the selection when we want to move it up. This means that the option will
     * subtract one index from the array.
     * 
     * @param {number} optionUUID - The uuid of the option that you want to move one position up.
     */
    function onMoveOptionUp(optionUUID) {
        const optionIndex = field.options.findIndex(option => option.uuid === optionUUID)

        if (optionIndex !== -1 && optionIndex > 0) {
            const newIndex = optionIndex - 1
            const optionToSwap = field.options[optionIndex]
            field.options[optionIndex] = field.options[newIndex]
            field.options[newIndex] = optionToSwap
            setOptions(getSelectOptions())
            setField(field)
            onChangeField(field, ['options'])
        }
    }

    /**
     * Function used on each option in the selection menu for when we want to move it down. This means the option
     * will add one index from the array. Obviously we cannot move the option that is at the bottom.
     * 
     * @param {number} optionUUID - The uuid of the option that you want to move one position down.
     */
    function onMoveOptionDown(optionUUID) {
        const optionIndex = field.options.findIndex(option => option.uuid === optionUUID)
    
        if (optionIndex !== -1 && optionIndex < field.options.length - 1) {
            const newIndex = optionIndex + 1
            const optionToSwap = field.options[optionIndex]
            field.options[optionIndex] = field.options[newIndex]
            field.options[newIndex] = optionToSwap
            setOptions(getSelectOptions())
            setField(field)
            onChangeField(field, ['options'])
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
        field.options.push({
            uuid: generateUUID(),
            value: optionValue,
            color: color
        })
        setOptions(getSelectOptions())
        setField(field)
        onChangeField(field, ['options'])
    }

    /**
     * Function for removing an existing option from the options array. 
     * 
     * @param {string} optionUUID - The uuid of the option that we want to remove.
     */
    function onRemoveOption(optionUUID) {
        field.options = field.options.filter(option => option.uuid !== optionUUID)
        setOptions(getSelectOptions())
        setField(field)
        onChangeField(field, ['options'])
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
        if (optionsType === 'option') {
            field.optionField.isDropdown = isDropdown
            onChangeField(field, ['optionField'])
        } else if (optionsType === 'tags') {
            field.tagsField.isDropdown = isDropdown
            onChangeField(field, ['tagsField'])
        }
        setField(field)
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

    /**
     * This is the function that will be called whenever we want to duplicate the field type.
     * We recieve the new field and first we reset the options uuid, then we reset the optionField uuid
     * and the tagsField uuid.
     * 
     * @param {object} newField - The new field that we want to duplicate.
     */
    function onDuplicateOptionOrTagField(newField) {
        newField.options = newField.options.map(option => { 
            option.uuid = generateUUID()
            return option
        })
        if (optionsType === 'option') {
            const isOptionFieldDataDefined = typeof newField.optionField === 'object' && ![null, undefined].includes(newField.optionField)
            if (isOptionFieldDataDefined === false) {
                newField.optionField = createOptionFieldData()
            } else {
                newField.optionField.uuid = generateUUID()
            }
        } else if (optionsType === 'tags') {
            const isTagsFieldDataDefined = typeof newField.tagsField === 'object' && ![null, undefined].includes(newField.tagsField)
            if (isTagsFieldDataDefined === false) {
                newField.tagsField = createTagsFieldData()
            } else {
                newField.tagsField.uuid = generateUUID()
            }
        }
    }

    /**
     * This effect calls the function to add the `tagsField` option and the `optionField` option.
     */
    useEffect(() => {
        onDefaultCreateOptionOrTagsOptionsIfDoesNotExist()
        registerOnDuplicateOfField(field.uuid, onDuplicateOptionOrTagField)
    }, [])

    /**
     * This will change the state of the custom options in the field menu. This way we can update the state in this component when we change something here.
     * For example the `isDropdown` state will be changed when the user toggles between the switch in the field menu.
     */
    useEffect(() => {
        if (optionsType === 'option') {
            const isOptionFieldDataDefinedAndIsDropdownDefined = typeof field.optionField === 'object' && ![null, undefined].includes(field.optionField) && 
                typeof field.optionField.isDropdown === 'boolean' 
            registerComponentForFieldSpecificOptionsForDropdownMenu(OptionFormatOption, {
                isDropdown: isOptionFieldDataDefinedAndIsDropdownDefined ? field.optionField.isDropdown : true,
                onChangeIfIsDropdownMenu
            })
        } else if (optionsType === 'tags') {
            const isTagsFieldDataDefinedAndIsDropdownDefined = typeof field.tagsField === 'object' && ![null, undefined].includes(field.optionField) && 
                typeof field.tagsField.isDropdown === 'boolean' 
            registerComponentForFieldSpecificOptionsForDropdownMenu(TagsFormatOption, {
                isDropdown: isTagsFieldDataDefinedAndIsDropdownDefined ? field.tagsField.isDropdown : true,
                onChangeIfIsDropdownMenu
            })
        }
    }, [field?.optionField?.isDropdown, field?.tagsField?.isDropdown])

    useEffect(() => {
        const isFieldOptionsDifferentFromOptions = JSON.stringify(options) !== JSON.stringify(field.options)
        if (isFieldOptionsDifferentFromOptions) {
            setOptions(getSelectOptions())
        }
    }, [field.options])

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
    }
}