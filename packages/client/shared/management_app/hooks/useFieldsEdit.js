import { useRef, useState, useEffect } from 'react'
import { deepCopy, generateUUID } from '../../../../shared/utils'
import { strings } from '../../core'
import useFieldTypes from './useFieldTypes'

/**
 * Hook used for managing the fields inside of the formulary, listing, or whatever. This handles
 * the adding, removing and duplicating of fields. This also handles the change of the field. So whenever
 * we need to make some changes to the field configuration we should need to use this hook.
 * 
 * This means we don't change the field directly inside of the field but we change each field using the component
 * that holds all of the fields.
 * 
 * @param {Array<{
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
 *      required: boolean
 * }>} fieldsData - All of the fields inside of the field or the formulary.
 * @param {(newFields: fieldsData) => void} onChangeFieldsData - Function that will be called when we need
 * to update the fields array inside of a field or a formulary.
 */
export default function useFieldsEdit(fieldsData, onChangeFieldsData) {
    const onDuplicateCallbackByFieldUUIDRef = useRef({})
    const onDeleteCallbackByFieldUUIDRef = useRef({})
    const retrieveFieldsCallbackByFieldUUIDRef = useRef({})
    const fieldUUIDsByIndexPoisitonRef = useRef({})
    const fieldsCacheRef = useRef([])
    const isToRecalculateFieldsRef = useRef(true)


    const [fields, setFields] = useState(fieldsData)
    const [newFieldUUID, setNewFieldUUID] = useState(null)

    const { getFieldTypeLabelNameByFieldTypeId } = useFieldTypes()

    /**
     * This function is used to change the fields array data. When the fields array data is changed,
     * we also update the parent component state.
     * 
     * @param {Array<{
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
     *      required: boolean
     * }>} fields - The new fields array data.
     */
    function onChangeFields(fields) {
        isToRecalculateFieldsRef.current = false
        setFields(fields)
        onChangeFieldsData(fields)
    }

    /**
     * Registers a callback function to be called when we want to duplicate the field, this callback will recieve
     * the new field data duplicated and it should update the state in place.
     * 
     * @param {string} fieldUUID - The field uuid to register the callback for.
     * @param {(fieldData: object) => void} callback - The callback function to be called when we 
     * want to duplicate the field.
     */
    function registerOnDuplicateOfField(fieldUUID, callback) {
        onDuplicateCallbackByFieldUUIDRef.current[fieldUUID] = callback
    }

    /**
     * Registers a callback function to be called when we want to remove the field, this callback will recieve
     * the field data removed and then you can have whatever logic you need.
     * 
     * @param {string} fieldUUID - The field uuid to register the callback for.
     * @param {(fieldData: object) => void} callback - The callback function to be called when we
     * want to remove the field.
     */
    function registerOnDeleteOfField(fieldUUID, callback) {
        onDeleteCallbackByFieldUUIDRef.current[fieldUUID] = callback
    }

    /**
     * This function is used to register the callback function that will be called to retrieve the fields of a field.
     * For example, `multi_fields` field type has fields in it. So when we are retrieving all of the fields of the formulary
     * we need to know how to retrieve those fields. Instead of appending this logic to the formulary (since we can have
     * multiple field types) we keep the logic on the field, so when we pass over this field we retrieve the fields inside of it.
     * 
     * @param {string} fieldUUID - The uuid of the field that has fields in it.
     * @param {() => Array<{
      *      uuid: string,
      *      name: string,
      *      labelName: string,
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
      *      required: boolean
      * }>} callback - The function that will be called to retrieve the fields of the field.
      */
    function registerRetrieveFieldsOfField(fieldUUID, callback) {
        retrieveFieldsCallbackByFieldUUIDRef.current[fieldUUID] = callback
    }

    /**
     * This function is used to retrieve the label name of the field. For example, when we create a new field, if
     * the `Opção` field already exist and we are adding the name `Opção` we need to add a new field with this new
     * name.
     * 
     * @param {string} newFieldLabelName - The label name of the field that is being added
     * @param {boolean} [isDuplicatingField=false] - is the field being duplicated or a new field is being created?
     */
    function verifyIfNameExistAndCreateNewName(newFieldLabelName, isDuplicatingField=false) {
        const allFields = retrieveFields()
        const fieldLabelNames = allFields.map(field => field.label.name)
        let copyNumber = 0
        while (fieldLabelNames.includes(newFieldLabelName)) {
            let duplicatedFieldLabelName = `${strings('formularyNewFieldLabel')} ${newFieldLabelName}`
            if (isDuplicatingField) {
                duplicatedFieldLabelName = `${newFieldLabelName} ${strings('formularyCopyFieldLabel')}`
            }

            if (copyNumber > 0) {
                duplicatedFieldLabelName = `${duplicatedFieldLabelName} ${copyNumber}`
            }
            newFieldLabelName = duplicatedFieldLabelName
            copyNumber++
        }

        return newFieldLabelName
    }

    /**
     * Used for adding a new field to the formulary. The data and logic for adding a new field is defined here.
     * 
     * After adding a new field we change the `newFieldUUID` so we can have a special behavior for the field that 
     * is being added. For example, the renaming and the configuration of the field will be shown.
     * 
     * @param {number} fieldTypeId - The field type id of the field that is being added.
     * @param {number} indexToAddField - The index of where the field should be added to in the fields array.
     */
    function onAddField(fieldTypeId, indexToAddField) {
        const isIndexToAddFieldBiggerThanFieldsLength = indexToAddField >= fields.length
        indexToAddField = isIndexToAddFieldBiggerThanFieldsLength ? fields.length : indexToAddField

        const newField = {
            fieldIsHidden: false,
            isUnique: false,
            labelIsHidden: false,
            fieldTypeId,
            label: {
                name: getFieldTypeLabelNameByFieldTypeId(fieldTypeId),
                labelImageBucket: null,
                labelImagePath: null,
                labelImageUrl: null
            },
            labelName: getFieldTypeLabelNameByFieldTypeId(fieldTypeId),
            name: 'novocampo',
            options: [],
            placeholder: null,
            required: false,
            uuid: generateUUID()
        }
        
        newField.order = indexToAddField
        newField.label.name = verifyIfNameExistAndCreateNewName(newField.label.name)

        fields.splice(indexToAddField, 0, newField)

        setNewFieldUUID(newField.uuid)
        onChangeFields([...fields])
    }

    /**
     * This will be used to remove a field from the fields state. Since we can add callbacks for when the `onDelete`
     * is called we call the callback of the fields here before actually removing the fields.
     * 
     * @param {object} fieldData - The data of the field that is being removed from the fields array state.
     */
    async function onRemoveField(fieldData) {
        const isCallbackDefined = typeof onDeleteCallbackByFieldUUIDRef.current[fieldData.uuid] === 'function'
        if (isCallbackDefined) {
            const onDeleteCallbackOfField = onDeleteCallbackByFieldUUIDRef.current[fieldData.uuid]
            await Promise.resolve(onDeleteCallbackOfField(fieldData))
        }
        const newFields = fields.filter(field => field.uuid !== fieldData.uuid)
        onChangeFields(newFields)
    }

    /**
     * This is the function that is called when the user clicks to duplicate the field in the `FieldEditMenuDropdown` component.
     * In other words, in the dropdown menu to edit the field, the user can click to duplicate the field, when he does this
     * we need to generate new uuid's/ids to the values that exists, instead of handling this inside of a single function fot all
     * of the field types, each field type handles their own logic for duplicating the field.
     * 
     * @param {{
     *      uuid: string,
     *      name: string,
     *      labelName: string,
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
     *      required: boolean
     * }} fieldData - The data of the field that is being duplicated.
     * @param {boolean} [doNotUpdateState=false] - This means that the state should not be updated so we only need
     * to retrieve the new field data.
     * 
     * @returns {Promise<object | null>} - Returns either the fieldData duplicated or null.
     */
    async function onDuplicateField(fieldData, doNotUpdateState=false) {
        const originalFieldUUID = fieldData.uuid
        const fieldIndexInFields = fields.findIndex(field => field.uuid === originalFieldUUID)
        const doesExistFieldIndexInFiels = fieldIndexInFields !== -1

        if (doesExistFieldIndexInFiels) {
            const newField = deepCopy(fieldData)
            newField.uuid = generateUUID()

            const isCallbackDefined = typeof onDuplicateCallbackByFieldUUIDRef.current[originalFieldUUID] === 'function'
            if (isCallbackDefined) {
                const onDuplicateCallbackOfField = onDuplicateCallbackByFieldUUIDRef.current[originalFieldUUID]
                await Promise.resolve(onDuplicateCallbackOfField(newField))
            }

            newField.label.name = verifyIfNameExistAndCreateNewName(newField.label.name, true)
            if (doNotUpdateState === true) {
                return newField
            } else {
                fields.splice(fieldIndexInFields + 1, 0, newField)

                setNewFieldUUID(newField.uuid)
                onChangeFields([...fields])
            }
        }
        return null
    }

    /**
     * This is passed as props to the fields and is used to change the field data in the fields array.
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
     *      required: boolean
     * }} newFieldData - The new field data, this is the data for the field.
     * @param {boolean} [isToForceToRefindIndex=false] - This is used so we will not use the cache index.
     * To make it faster instead of finding everytime in the list of fields what we do is that we save 
     * the indexes in an object so we just retrieve the index of the field in the object.
     */
    function onChangeField(newFieldData, isToForceToRefindIndex=false) {
        const fieldUUID = newFieldData.uuid
        const doesFieldUUIDsExistInChache = typeof fieldUUIDsByIndexPoisitonRef.current[fieldUUID] === 'number'
        const fieldUUIDIndex = doesFieldUUIDsExistInChache && isToForceToRefindIndex === false ?
            fieldUUIDsByIndexPoisitonRef.current[fieldUUID] : fields.findIndex(field => field.uuid === fieldUUID)
        const doesFieldUUIDExist = fieldUUIDIndex !== -1
        if (doesFieldUUIDExist) {
            fieldUUIDsByIndexPoisitonRef.current[fieldUUID] = fieldUUIDIndex
            fields[fieldUUIDIndex] = newFieldData
            onChangeFields([...fields])
        }
    }

    /**
     * Callback used to retrieve all of the field of the formulary. When we retrieve the fields of the formulary
     * we need a way to retrieve those fields tied to a specific field. That's because we, at the current time,
     * has the field type called 'multi_field' which is field that contains other fields.
     * 
     * We don't want to add logic tied to fields here, this means there are 2 ways to do this.
     * 1 - When we find a `multi_fields` we get the fields tied to it. This means that this function should know
     * that `multi_fields` field type has fields. This is a good approach, but this means we are adding logic
     * of fields and how they work outside of the field component
     * 2 - This is what we use. Instead of adding the logic directly here, we give a way for fields to notify
     * they have fields, and when we request the fields again with this function we call the function on the field
     * that has fields in it. It's like: "HEY, are you retrieving fields? I have fields in myself, let me get them for you".
     * 
     * With this generalistic approach we can have the logic needed inside of the fields directly.
     * 
     * So how does this work? We pass the `registerRetrieveFieldsCallback` to the fields, if some field has fields in it, 
     * it should register the callback using this function.
     * 
     * So for example in the `multi_fields` component we will have something like: 
     * ```
     * function retrieveFields() {
     *      // code to retrieve the fields here.
     * }
     * 
     * useEffect(() => {
     *      props.registerRetrieveFieldsCallback(props.field.uuid, retrieveFields)
     * }, [])
     * ```
     * 
     * Then the props.retrieveFieldsCallbacksRef.current will look like that:
     * ```
     * {
     *      'd7785a43-ab91-4308-ac40-e6c33b3292ef': () => Array<fields>
     * }
     * ```
     * Supposing that `d7785a43-ab91-4308-ac40-e6c33b3292ef` is the uuid of a multi_field array, this gives access for us to
     * retrieve the fields inside of this field when needed.
     * 
     * @returns {Array<{
     *      uuid: string,
     *      name: string,
     *      labelName: string,
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
     *      required: boolean
     * }>} - Returns an array of the fields inside of this formulary.
     */
    function retrieveFields() {
        function retrieveNestedFieldsFromFieldsWithFieldsInIt(field, fields) {
            const isFieldWithFieldsInIt = typeof retrieveFieldsCallbackByFieldUUIDRef.current[field.uuid] === 'function'
            if (isFieldWithFieldsInIt) {
                const fieldsOfFieldWithFieldsInIt = retrieveFieldsCallbackByFieldUUIDRef.current[field.uuid]()
                for (const fieldOfFieldWithFieldsInIt of fieldsOfFieldWithFieldsInIt) {
                    const copiedFieldOfFieldWithFieldsInIt = deepCopy(fieldOfFieldWithFieldsInIt)
                    fields.push(copiedFieldOfFieldWithFieldsInIt)
                    retrieveNestedFieldsFromFieldsWithFieldsInIt(copiedFieldOfFieldWithFieldsInIt, fields)
                }
            }
        } 

        if (isToRecalculateFieldsRef.current === true) {
            const newFields = []
            for (const field of fields) {
                const copiedField = deepCopy(field)
                newFields.push(copiedField)
                retrieveNestedFieldsFromFieldsWithFieldsInIt(copiedField, newFields)
            }
            fieldsCacheRef.current = newFields
        }
        return fieldsCacheRef.current
    }

    /**
     * If the external value of the fields change the internal value should also change.
     */
    useEffect(() => {
        const isFieldsDataDifferentFromInternalStateFields = JSON.stringify(fieldsData) !== JSON.stringify(fields)
        if (isFieldsDataDifferentFromInternalStateFields) {
            setFields(fieldsData)
        }
    }, [fieldsData])

    return {
        newFieldUUID,
        registerOnDuplicateOfField,
        registerOnDeleteOfField,
        registerRetrieveFieldsOfField,
        isToRecalculateFieldsRef,
        onDuplicateCallbackByFieldUUIDRef,
        onDeleteCallbackByFieldUUIDRef,
        retrieveFields,
        onAddField,
        onRemoveField,
        onChangeField,
        onDuplicateField
    }
}