import { useRef, useEffect, useState, useContext } from 'react'
import { AppManagementTypesContext } from '../contexts'
import { generateUUID } from '../../../../shared/utils'
import useFieldsEdit from './useFieldsEdit'

/**
 * Hook used for handling the `multi_fields` field type. As you probably already know (if you read the 
 * model from the backend), the `multi_fields` will create an structure that can be repeated multiple times.
 * For example, let's say that we want to simulate a comment section. We can have the `date` field type, The
 * `user` field type and the `commentary` which is a long_text field type. So each `commentary` will be a repeat
 * of this structure  of 3 fields. You can add a new comentary in the same formulary without needing to rely on 
 * special connections and all that.
 * 
 * Another example would be for example, in a `sales` example and perspective. Usually sales funnel needs to have
 * the `history` of the conversation. The history have a simple structure: The date and the history commentary. One formulary
 * can have multiple histories. 
 * 
 * In a more tecnhnical view, the logic here is rather similar to the `formulary` itself. You will see that we use the
 * `useFieldsEdit` hook which is used in the formulary to handle all of the fields. So the logic is like: whenever we update
 * one of thefields of this field, we update the field, that in consequence will update the formulary itself. Be aware:
 * to prevent recursion and other issues that could be caused, an user cannot create a `multi_field` inside of a `multi_fields`,
 * of course this would open certain doors but it's not that good idea.
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
 *      required: boolean,
 *      multiFieldsField: {
 *          uuid: string,
 *          fields: Array<fieldData>
 *      }
 * }} fieldData - The data of the field that will be saved in a state internally inside of the hook itself.
 * @param {(newFieldData: fieldData) => void} onChangeField - Callback that will be called whenever we change any 
 * configuration of the field. as well as changes to the fields inside of this field.
 * @param {(callback: (newDuplicatedField: fieldData) => void) => void} registerOnDuplicateOfField - This will
 * register the function that handles the logic for when the field is duplicated.
 * @param {(callback: () => Array<fieldData>) => void} registerRetrieveFieldsOfField - This is a function that registers
 * what happens when the duplicated field is called.
 */
export default function useMultiFieldsField(
    fieldData, onChangeField, registerOnDuplicateOfField, registerRetrieveFieldsOfField
) {
    const fieldTypesRef = useRef([])
    const hasFieldTypesChangedRef = useRef(true)
    const fieldRef = useRef(fieldData)

    const [field, _setField] = useState(fieldData)
    const [sections, setSections] = useState([])
    const [activeSectionUUID, setActiveSectionUUID] = useState(null)
    
    const { state: { types: { fieldTypes } } } = useContext(AppManagementTypesContext)

    const {
        newFieldUUID,
        registerOnDeleteOfField: registerOnDeleteOfFieldFromMultiFieldsField,
        registerOnDuplicateOfField: registerOnDuplicateOfFieldFromMultiFieldsField,
        onAddField,
        onRemoveField: onRemoveFieldFromMultiFieldsField,
        onDuplicateField: onDuplicateFieldFromMultiFieldsField,
        onChangeField: onChangeFieldFromMultiFieldsField
    } = useFieldsEdit(field.multiFieldsField.fields, onChangeFields)

    function setField(state) {
        fieldRef.current = state
        _setField(state)
    }


    function onChangeFields(newFields) {
        field.multiFieldsField.fields = newFields
        setField(field)
        onChangeField(field.uuid, {...field})
    }

    /**
     * When we retrieve the fields for any place inside of the formulary we need to retrieve the fields 
     * of the fields that contain fields. This might seem confusing at first but it makes sense.
     * 
     * We don't keep the logic for the formulary to know which field type has fields in it, instead we have a way
     * of being able to tell that the field has fields in it. With this way we can have multiple field types
     * that have fields in it, and we keep the logic localised and concise. So instead of having an `if statement`
     * for each of the field types with fields in it, we dispose a way to know if a field has fields in it.
     * 
     * @returns {Array<{
     *      uuid: string,
     *      name: string,
     *      labelName: string,
     *      labelIsHidden: boolean,
     *      fieldIsHidden: boolean,
     *      label: {
     *          name: string
     *      },
     *      fieldTypeId: number,
     *      isUnique: boolean,
     *      options: Array<{
     *          uuid: string, 
     *          value: string, 
     *          order: number, 
     *          color: string
     *      }>,
     *      placeholder: null | string,
     *      required: boolean
     * }>} - Returns an array of the fields inside of this specific field.
     */
    function retrieveFieldsOfMultiFieldCallback() {
        return fieldRef.current.multiFieldsField.fields
    }

    function createMultiFieldsFieldData({ fields=[] } = {}) {
        return {
            uuid: generateUUID(),
            fields
        }
    }

    function onAddSection() {
        const newSection = {
            uuid: generateUUID(),
            values: []
        } 
        setSections([newSection,...sections])
    }

    /**
     * This will remove a section of fields when the user clicks the `trash` icon.
     * 
     * @param {string} sectionUUID - The uuid of the section to be removed.
     */
    function onRemoveSection(sectionUUID) {
        const newSections = sections.filter(section => section.uuid !== sectionUUID)
        setSections(newSections)
    }

    /**
     * The user is not allowed to create some field types inside of the `multi_field` field type.
     * Right now the only field type not allowed is the `multi_field` field type.
     * 
     * @returns {Array<{id: number, name: string}>} - The field types that are allowed to be added
     * to the formulary.
     */
    function getFieldTypes() {
        if (hasFieldTypesChangedRef.current === true) {
            fieldTypesRef.current = []
            for (const fieldType of fieldTypes) {
                if (fieldType.name !== 'multi_field') {
                    fieldTypesRef.current.push(fieldType)
                }
            }
            hasFieldTypesChangedRef.current = false
        }
        return fieldTypesRef.current
    }

    /**
     * When the user adds a new field inside of the multi_fields field type we need to make sure of the active section uuid
     * this ways we will not open the field edit menu in all of the fields.
     * 
     * @param {number} fieldTypeId - The id of the fieldType selected to be added.
     * @param {number} indexToAddField - The index that we want to add the field to.
     * @param {string} activeSectionUUID - The uuid of the section that we are adding the field to. Each section repeats the field
     * N times. What this does is that we guarantee that the field edit menu will be opened just once.
     */
    function onAddFieldFromMultiFieldsField(fieldTypeId, indexToAddField, activeSectionUUID) {
        onAddField(fieldTypeId, indexToAddField)
        setActiveSectionUUID(activeSectionUUID)
    }

    /**
     * When we duplicate the `multi_fields` field type what we do is that we call the onDuplicateField
     * for each of the fields inside. That's because we can't have fields with the same name inside, and
     * we also have some special logic for each field type that needs to taken into account.
     * 
     * @param {object} newField - The new field that was duplicated.
     */
    async function onDuplicateMultiFieldsField(newField) {
        newField.multiFieldsField.fields = await Promise.all(
            newField.multiFieldsField.fields.map(field => 
                onDuplicateFieldFromMultiFieldsField(field, true)
            )
        )
        newField.multiFieldsField.uuid = generateUUID()
    }

    /**
     * If the field is not an attachment, or at least it has just been changed to an attachment, then we need to create the
     * attachment field data. This data will be used to configure the `attachment` field type with custom data.
     */
    function onDefaultCreateMultiFieldsOptionsIfDoesNotExist() {
        const doesFieldMultiFieldsDataExists = typeof field.multiFieldsField === 'object' && ![null, undefined].includes(field.multiFieldsField)
        if (doesFieldMultiFieldsDataExists === false) {
            field.multiFieldsField = createMultiFieldsFieldData()
            setField(field)
            onChangeField(field, ['multiFieldsField'])
        }
    }

    useEffect(() => {
        onDefaultCreateMultiFieldsOptionsIfDoesNotExist()
        registerOnDuplicateOfField(field.uuid, onDuplicateMultiFieldsField)
        registerRetrieveFieldsOfField(field.uuid, retrieveFieldsOfMultiFieldCallback)
    }, [])

    useEffect(() => {
        hasFieldTypesChangedRef.current = true
        getFieldTypes()
    }, [fieldTypes])

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
        sections,
        activeSectionUUID,
        onAddSection,
        onRemoveSection,
        getFieldTypes,
        newFieldUUID,
        onAddFieldFromMultiFieldsField,
        onRemoveFieldFromMultiFieldsField,
        onDuplicateFieldFromMultiFieldsField,
        registerOnDeleteOfFieldFromMultiFieldsField,
        registerOnDuplicateOfFieldFromMultiFieldsField,
        onChangeFieldFromMultiFieldsField
    }
}