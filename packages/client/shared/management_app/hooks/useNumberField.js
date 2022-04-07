import { useEffect, useState, useContext } from 'react'
import { strings } from '../../core'
import { NumberDropdownMenuOptions } from '../components/Formulary.Field.Number'
import { generateUUID } from '../../../../shared/utils'
import { AppManagementTypesContext } from '../contexts'

/**
 * Hook used for configuring and handling the logic for the number field, whenever you need to edit or configure
 * a number field type you can use this custom hook. This makes it simple to add logic whenever it's needed.
 * 
 * @param {{
 *      uuid: string,
 *      labelIsHidden: boolean,
 *      fieldIsHidden: boolean,
 *      fieldTypeId: number,
 *      label: {
 *          name: string
 *      },
 *      isUnique: boolean,
 *      options: Array<{
 *          uuid: string, 
 *          value: string, 
 *          order: number, 
 *          color: string
 *      }>,
 *      placeholder: null | string,
 *      required: boolean,
 *      numberField: {
 *          allowNegative: boolean,
 *          allowZero: boolean,
 *          decimalCharacter: string,
 *          thousandSeparatorCharacter: string,
 *          numberFormatTypeId: number | null,
 *          prefix: string | null
 *      }
 * }} fieldData - The data of the field that is being edited.
 * @param {(fieldData: object, namespaces: Array<string>) => void} onChangeField - This is the function that is called when the user 
 * changes the value of the field.
 * @param {(component: import('react').ReactElement, props: object) => void} registerComponentForFieldSpecificOptionsForDropdownMenu - 
 * Function used for registering the component inside of the `FieldEditDropdownMenu` component.
 * @param {(callback: (fieldData: object) => void) => void} registerOnDuplicateOfField - Function used for registeing
 * a callback when we duplicate the field.
 */
export default function useNumberField(
    fieldData, onChangeField, registerComponentForFieldSpecificOptionsForDropdownMenu,
    registerOnDuplicateOfField
) {
    const [field, setField] = useState(fieldData)
    const { state: { types } } = useContext(AppManagementTypesContext)

    /**
     * Handles when we create a new `numberField` data. This data is used to add extra data needed
     * specific to the number field type.
     * 
     * In here we will define if the number can be negative, if we allow zero and all other options for
     * the number field type.
     * 
     * @param {object} numberFieldData - The params for the number field type.
     * @param {boolean} [numberFieldData.allowNegative=true] - Can the number be negative or not?
     * @param {boolean} [numberFieldData.allowZero=true] - Can the number be 0? Or it needs to be a number?
     * @param {string} [numberFieldData.decimalCharacter=strings('formularyFieldNumberDefaultDecimalCharacter')] - 
     * The character for the decimal separator, some countries use '.', some countries use ',', we have full control of
     * it directly in the field definition.
     * @param {string} [numberFieldData.thousandSeparatorCharacter=strings('formularyFieldNumberDefaultThousandSeparatorCharacter')] - 
     * Same as the `decimalCharacter`, if the `decimalCharacter` is '.' then we cannot use '.' for the thousandSeparator.
     * Just for your understanding, the thousand separator is this 
     * 1.000.000,10 -> '.' is the thousand separator in this example and ',' is the decimal separator.
     * @param {number} [numberFormatTypeId=null] - The id of the number formatting. This is exactly how we will format the number.
     * @param {string} [prefix=null] - Some string that you want to add to the start of the number.
     * 
     * @returns {{
     *      allowNegative: boolean,
     *      allowZero: boolean,
     *      decimalCharacter: string,
     *      thousandSeparatorCharacter: string,
     *      numberFormatTypeId: number | null,
     *      prefix: string | null
     * }} - Returns the object for the data needed to format the number field type.
     */
    function createNumberFieldData({
        allowNegative=true, 
        allowZero=true, 
        decimalCharacter=strings('formularyFieldNumberDefaultDecimalCharacter'),
        thousandSeparatorCharacter=strings('formularyFieldNumberDefaultThousandSeparatorCharacter'),
        numberFormatTypeId=null,
        prefix=null
    }={}) {
        const isNumberFormatTypeIdDefined = typeof numberFormatTypeId === 'number'
        if (isNumberFormatTypeIdDefined === false) {
            const numberFormatType = types.numberFormatTypes.find(numberFormatType => numberFormatType.name === 'integer')
            const doesIntegerNumberFormatTypeExists = ![null, undefined, -1].includes(numberFormatType)
            if (doesIntegerNumberFormatTypeExists) numberFormatTypeId = numberFormatType.id
        }

        return {
            allowNegative: allowNegative,
            allowZero: allowZero,
            decimalCharacter: decimalCharacter,
            thousandSeparatorCharacter: thousandSeparatorCharacter,
            prefix: prefix,
            numberFormatTypeId: numberFormatTypeId,
            uuid: generateUUID()
        }
    }

    /**
     * When we change the numberFormatType of the field we call this callback. This will create a new 
     * numberField data if needed, or it will directly alter the numberFormatTypeId in the `numberField` object.
     * 
     * @param {number} numberFormatTypeId - One of the ids of the `numberFormatType` array.
     */
    function onChangeFormatType(numberFormatTypeId) {
        const doesNumberFieldDataExist = typeof field.numberField === 'object'
        if (doesNumberFieldDataExist) {
            field.numberField.numberFormatTypeId = numberFormatTypeId
        } else {
            field.numberField = createNumberFieldData({ numberFormatTypeId: numberFormatTypeId })
        }
        setField(field)
        onChangeField(field)
    }

    /**
     * Logic for duplicating a number field type. When we duplicate this field type what we need to do is that
     * we need to regenerate the numberField uuid. This way we will not have any conflicts with the old
     * numberField configuration uuid to the new one.
     * 
     * @param {object} newField - The new field data.
     */
    function onDuplicateNumberField(newField) {
        newField.numberField.uuid = generateUUID()
    }

    /**
     * When we create a new field type we need to create the `numberField` data. This data is responsible for
     * the number formatting and how we display the number to the end user. So what this does is that
     * when the component is loaded we will check if the `numberField` exists and then we will create it if it
     * does not exist.
     */
    function checkIfNumberFieldDataExistsAndIfNotCreateIt() {
        const doesNumberFieldDataExist = typeof field.numberField === 'object' && ![null, undefined].includes(field.numberField)
        if (doesNumberFieldDataExist === false) {
            field.numberField = createNumberFieldData()
        }
        setField(field)
        onChangeField(field)
    }

    useEffect(() => {
        checkIfNumberFieldDataExistsAndIfNotCreateIt()
        registerOnDuplicateOfField(field.uuid, onDuplicateNumberField)
    }, [])

    /**
     * When the external field changes we should also change the internal field value.
     */
       useEffect(() => {
        const isFieldDifferentFromStateField = typeof fieldData !== typeof field && JSON.stringify(fieldData) !== JSON.stringify(field)
        if (isFieldDifferentFromStateField) {
            setField(fieldData)
        }
    }, [fieldData])
    /**
     * This is used to add the custom options to the dropdown menu, those custom options are defined here so we can keep it
     * closely tied to the component responsible for it. Instead of needing to separate the logic between multiple components
     * when you think about `number` field type you will only need to come to this component, it is really easy to setup
     * and for maintenance.
     */
    useEffect(() => {
        const selectedNumberFormatTypeId = typeof(field.numberField) === 'object' ? 
            field.numberField.numberFormatTypeId : null

        registerComponentForFieldSpecificOptionsForDropdownMenu(
            NumberDropdownMenuOptions, 
            {
                selectedId: selectedNumberFormatTypeId,
                onSelect: onChangeFormatType
            }
        )
    }, [field?.numberField?.numberFormatTypeId])
}