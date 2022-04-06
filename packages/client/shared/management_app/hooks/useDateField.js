import { useState, useEffect } from 'react'
import { generateUUID } from '../../../../shared/utils'


export default function useDateField(
    fieldData, onChangeFieldData, registerOnDuplicateOfField
) {
    const [isDatepickerOpen, setIsDatepickerOpen] = useState(false)
    const [field, setField] = useState(fieldData)

    function onChangeField(newFieldData) {
        setField(newFieldData)
        onChangeFieldData(newFieldData)
    }

    /**
     * This is used for toggling the datepicker to the open or closed states.
     * 
     * @param {boolean} [isOpe=!isDatepickerOpen] - Is the datepicker open or closed?
     */
    function onToggleDatepicker(isOpen=!isDatepickerOpen) {
        setIsDatepickerOpen(isOpen)
    }

    /**
     * This is called whenever the field is duplicated.
     * 
     * @param {object} newField - The new field that was duplicated.
     */
    function onDuplicateDateField(newField) {
        newField.dateField.uuid = generateUUID()
    }

    /**
     * This is used to register the duplication event of the field type.
     */
    useEffect(() => {
        registerOnDuplicateOfField(onDuplicateDateField)
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

    return {
        isDatepickerOpen,
        onToggleDatepicker
    }
}