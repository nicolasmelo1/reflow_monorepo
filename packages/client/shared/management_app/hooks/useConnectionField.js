import { useState, useEffect } from 'react' 
import { generateUUID } from '../../../../shared/utils'

export default function useConnectionField(
    fieldData, onChangeFieldData, registerOnDuplicateOfField
) {
    const [field, setField] = useState(fieldData)

    /**
     * This is used to create the connection data for the `connection` field type.
     * The data for this field type are the id of the formulary of the field to use
     * as option. In other words what we do is this:
     * 
     * Instead of showing all of the data for the options we aggregate all of them in a simple
     * from a single value.
     * 
     * @param {object} connectionFieldData - The data needed for the `connection` field type.
     * @param {number|null} [connectionFieldData.formularyId=null] - The formularyId of the `fieldAsOptionId`.
     * Bye default we don't aggregate all of the informations of the records. Instead we just show the values
     * of a particular field.
     * @param {string|null} [connectionFieldData.fieldAsOptionUUID=null] - The field uuid to use as option
     * for this connection field type. What this does is that this gets the uuid of the field to use as option
     * and then displays the values of this field as the options that the user is able to select.
     * 
     * @returns {{
     *      uuid: string,
     *      formularyId: formularyId,
     *      fieldAsOptionUUID: fieldAsOptionUUID
     * }} - Returns the object for the `connectionField` data of the `field` object
     */
    function createConnectionFieldData({
        formularyId=null,
        fieldAsOptionUUID=null
    }={}) {
        return {
            uuid: generateUUID(),
            formularyId,
            fieldAsOptionUUID
        }
    }

    /**
     * Handy function used to update the internal and external state of the field data at the same time.
     * 
     * @param {object} newFieldData - The new data of the field.
     */
    function onChangeField(newFieldData) {
        onChangeFieldData(newFieldData)
        setField(newFieldData)
    }

    /**
     * This is used to register the field option, this is the field that we want to use as option for
     * the select input of the connection field.
     * 
     * In other words, the values present on this field will be the options that the user can select.
     * 
     * @param {string} fieldAsOptionUUID - The uuid of the field to use as option.
     */
    function onChangeFieldAsOptionUUID(fieldAsOptionUUID) {
        field.connectionField.fieldAsOptionUUID = fieldAsOptionUUID
        onChangeField({...field})
    }

    /**
     * This is called whenever the field is duplicated.
     * 
     * @param {object} newField - The new field that was duplicated.
     */
    function onDuplicateField(newField) {
        const doesConnectionFieldExist = typeof newField.connectionField === 'object' && 
            ![null, undefined].includes(newField.connectionField)
        if (doesConnectionFieldExist) newField.connectionField.uuid = generateUUID()
        else newField.connectionField = createConnectionFieldData()
    }

    /**
     * When the `connection` field type was just created or if for some other reason the field does not have
     * `connection` specific data, we will create the data by default when the field is created.
     * 
     * This `connection` field data is a specific object that holds information specific for the `connection` 
     * field type.
     */
    function onDefaultCreateConnectionOptionsIfDoesNotExist() {
        const doesFieldConnectionDataExists = typeof field.connectionField === 'object' && 
            ![null, undefined].includes(field.connectionField)
        if (doesFieldConnectionDataExists === false) {
            field.connectionField = createConnectionFieldData()
            onChangeField(field)
        }
    }

    useEffect(() => {
        registerOnDuplicateOfField(onDuplicateField)
        onDefaultCreateConnectionOptionsIfDoesNotExist()
    }, [])

    /**
     * When the external field changes we should also change the internal field value.
     */
    useEffect(() => {
        const isFieldDifferentFromFieldData = JSON.stringify(fieldData) !== JSON.stringify(field)
        if (isFieldDifferentFromFieldData) {
            setField(fieldData)
        }
    }, [fieldData])

    return {
        onChangeFieldAsOptionUUID
    }
}