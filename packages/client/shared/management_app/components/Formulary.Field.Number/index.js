import { useRef, useState, useEffect } from 'react'
import { useDropdownMenuSelect } from '../../hooks'
import { strings } from '../../../core'
import { generateUUID } from '../../../../../shared/utils'
import Layout from './layouts'

function NumberFormatOption(props) {
    const menuRef = useRef()
    const menuButtonRef = useRef()
    const [selected, setSelected] = useState(props.selectedId)
    const { isOpen, onOpenMenu, menuPosition } = useDropdownMenuSelect({
        buttonRef: menuButtonRef,
        menuRef: menuRef
    })
    
    function onSelect(id) {
        setSelected(id)
        props.onSelect(id)
        onOpenMenu(false)
    }

    return (
        <Layout.DropdownMenu
        menuRef={menuRef}
        menuButtonRef={menuButtonRef}
        menuPosition={menuPosition}
        isOpen={isOpen}
        onOpenMenu={onOpenMenu}
        selected={selected}
        onSelect={onSelect}
        getNumberFormatTypeStringByName={props.getNumberFormatTypeStringByName}
        numberFormatTypes={props.numberFormatTypes}
        />
    )
}

export default function FormularyFieldNumber(props) {
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
    }) {
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
     * This is used to retrieve the number formatTypeString by the numberFormatTypeName, instead of showing
     * `percentage`, 'integer' and so on, we translate it to a more human readable label.
     * 
     * @param {string} numberFormatTypeName - Can be one of `number`, 'integer', 'percentage' or 'monetary'.
     * BUT BEAWARE, this can change at any type, that's why we don't add it to the specification of the param.
     * 
     * @returns {string} - Returns the numberFormatTypeName string if no translation is found, or return the actual
     * label translation.
     */
    function getNumberFormatTypeStringByName(numberFormatTypeName) {
        const capitalizedNumberFormatTypeName = numberFormatTypeName.charAt(0).toUpperCase() + 
            numberFormatTypeName.slice(1)
        const name = strings(`numberFormatType${capitalizedNumberFormatTypeName}Label`)
        return name !== undefined ? name : numberFormatTypeName
    }

    /**
     * When we change the numberFormatType of the field we call this callback. This will create a new 
     * numberField data if needed, or it will directly alter the numberFormatTypeId in the `numberField` object.
     * 
     * @param {number} numberFormatTypeId - One of the ids of the `props.types.numberFormatType` array.
     */
    function onChangeFormatType(numberFormatTypeId) {
        if (props.field.numberField === null) {
            props.field.numberField = createNumberFieldData({numberFormatTypeId: numberFormatTypeId})
        } else {
            props.field.numberField.numberFormatTypeId = numberFormatTypeId
        }
        props.onUpdateFormulary()
    }

    /**
     * This is used to add the custom options to the dropdown menu, those custom options are defined here so we can keep it
     * closely tied to the component responsible for it. Instead of needing to separate the logic between multiple components
     * when you think about `number` field type you will only need to come to this component, it is really easy to setup
     * and for maintenance.
     */
    useEffect(() => {
        const selectedNumberFormatTypeId = typeof(props.field.numberField) === 'object' ? 
            props.field.numberField.numberFormatTypeId : null

        props.addComponentForFieldSpecificOptionsForDropdownMenu(
            NumberFormatOption, 
            {
                selectedId: selectedNumberFormatTypeId,
                numberFormatTypes: props.types.numberFormatType,
                getNumberFormatTypeStringByName,
                onSelect: onChangeFormatType
            }
        )
    }, [props.field?.numberField?.numberFormatTypeId, props.types.numberFormatType])

    return (
        <Layout.Field
        types={props.types}
        field={props.field}
        />
    )
}
