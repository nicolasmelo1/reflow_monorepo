import { useState, useEffect, useContext } from 'react'
import { generateUUID } from '../../../../shared/utils'
import { DateFormatOption } from '../components/Formulary.Field.Date'
import { AppManagementTypesContext } from '../contexts'

export default function useDateField(
    fieldData, onChangeFieldData, registerComponentForFieldSpecificOptionsForDropdownMenu, 
    registerOnDuplicateOfField
) {
    const [isDatepickerOpen, setIsDatepickerOpen] = useState(false)
    const [field, setField] = useState(fieldData)
    const { state: { types }} = useContext(AppManagementTypesContext)

    /**
     * This will create the date field data for the `date` field if it does not exist yet.
     * We usually will create this on the first render.
     * 
     * @param {object} dateFieldData - The data of the `date` field type.
     * @param {boolean} [dateFieldData.autoCreate=false] - Does the date is automatically
     * generated for the user?
     * @param {boolean} [dateFieldData.autoUpdate=false] - Does the date is automatically
     * generated for the user when he updates or creates a record?
     * @param {number|null} [dateFieldData.dateFormatTypeId=null] - How the date will be formated and
     * displayed to the user. This is obligatory and cannot be null, if it's null we will set
     * this as the `local` date format type.
     * @param {number|null} [dateFieldData.timeFormatTypeId=null] - This is how the time will be formatted
     * to the user. This can be blank and it's not needed, if this is defined the user will need
     * to select a date as well as an hour.
     * 
     * @returns {{
     *      uuid: string,
     *      autoCreate: autoCreate,
     *      autoUpdate: autoUpdate,
     *      dateFormatTypeId: dateFormatTypeId,
     *      timeFormatTypeId: timeFormatTypeId
     * }} - Returns an object with all of the informations provided
     */
    function createDateFieldData({
        autoCreate=false, autoUpdate=false,
        dateFormatTypeId=null, timeFormatTypeId=null
    }={}) {
        const isDateFormatTypeIdDefined = typeof dateFormatTypeId === 'number'
        if (isDateFormatTypeIdDefined === false) {
            const localDateFormatType = types.dateFormatTypes.find(dateFormatType => dateFormatType.name === 'local')
            const doesLocalDateFormatTypeExists = typeof localDateFormatType === 'object' && 
                ![null, undefined].includes(localDateFormatType)
            if (doesLocalDateFormatTypeExists) dateFormatTypeId = localDateFormatType.id
        }
        return {
            uuid: generateUUID(),
            autoCreate,
            autoUpdate,
            dateFormatTypeId,
            timeFormatTypeId
        }
    }

    function onChangeField(newFieldData) {
        setField(newFieldData)
        onChangeFieldData(newFieldData)
    }

    function onToggleAutoCreate(isToAutoCreate) {
        console.log(isToAutoCreate)
        const doesDateFieldExistsInFieldObject = typeof field.dateField === 'object' && 
            ![null, undefined].includes(field.dateField)
        if (doesDateFieldExistsInFieldObject) {
            field.dateField.autoCreate = isToAutoCreate
        } else {
            field.dateField = createDateFieldData({ autoCreate: isToAutoCreate })
        }
        onChangeField(field)
    }

    function onToggleAutoUpdate(isToAutoUpdate) {
        const doesDateFieldExistsInFieldObject = typeof field.dateField === 'object' && 
            ![null, undefined].includes(field.dateField)
        if (doesDateFieldExistsInFieldObject) {
            field.dateField.autoUpdate = isToAutoUpdate
        } else {
            field.dateField = createDateFieldData({ autoUpdate: isToAutoUpdate })
        }
        onChangeField(field)
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
     * When the date field type was just created or if for some other reason the field does not have
     * date specific data, we will create the data by default when the field is created.
     * 
     * This date field data is a specific object that holds information specific for the `date` field type.
     */
    function onDefaultCreateDateOptionsIfDoesNotExist() {
        const doesDateFieldDataExist = typeof field.dateField === 'object' && 
            ![null, undefined].includes(field.dateField)
 
        if (doesDateFieldDataExist === false) {
            field.dateField = createDateFieldData()
            onChangeField(field)
        }
    }
    /**
     * This is used to register the duplication event of the field type.
     */
    useEffect(() => {
        onDefaultCreateDateOptionsIfDoesNotExist()
        registerOnDuplicateOfField(onDuplicateDateField)
    }, [])

    /**
     * When the external field changes we should also change the internal field value.
     */
    useEffect(() => {
        const isFieldDifferentFromStateField = typeof fieldData !== typeof field && 
            JSON.stringify(fieldData) !== JSON.stringify(field)
        if (isFieldDifferentFromStateField) {
            setField(fieldData)
        }
    }, [fieldData])

    /**
     * This is used to render the custom options for the `date` field type in the field edit dropdown menu.
     */
    useEffect(() => {
        let isToAutoCreate = false
        let isToAutoUpdate = false
        const doesDateFieldExistsInFieldObject = typeof field.dateField === 'object' && 
            ![null, undefined].includes(field.dateField)
        if (doesDateFieldExistsInFieldObject) {
            isToAutoCreate = field.dateField.autoCreate
            isToAutoUpdate = field.dateField.autoUpdate
        }
        registerComponentForFieldSpecificOptionsForDropdownMenu(DateFormatOption, {
            autoCreate: isToAutoCreate,
            autoUpdate: isToAutoUpdate,
            onChangeAutoCreate: onToggleAutoCreate,
            onChangeAutoUpdate: onToggleAutoUpdate
        })
    } , [field?.dateField?.autoCreate, field?.dateField?.autoUpdate])

    return {
        isDatepickerOpen,
        onToggleDatepicker
    }
}