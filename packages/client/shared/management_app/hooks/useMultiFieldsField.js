import { useRef, useEffect, useState, useContext } from 'react'
import { AppManagementTypesContext } from '../contexts'
import { generateUUID } from '../../../../shared/utils'

export default function useMultiFieldsField(
    fieldData, onChangeField
) {
    const fieldTypesRef = useRef([])
    const hasFieldTypesChangedRef = useRef(true)
    
    const [field, setField] = useState(fieldData)
    const [sections, setSections] = useState([])
    const [newFieldUUID, setNewFieldUUID] = useState(null)
    const [activeSectionUUID, setActiveSectionUUID] = useState(null)

    const { state: { types: { fieldTypes } } } = useContext(AppManagementTypesContext)
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
        return props.field.multiFieldsField.fields
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
     * Callback for adding a field inside of the current `multi_field` field.
     * 
     * @param {object} fieldData - The data of the field that is being added.
     * @param {number} indexToAdd - The index that we need to add the field to.
     */
    function onAddField(fieldData, indexToAdd, activeSectionUUID) {
        fieldData.order = indexToAdd
        props.field.multiFieldsField.fields.splice(indexToAdd, 0, fieldData)
        setNewFieldUUID(fieldData.uuid)
        setActiveSectionUUID(activeSectionUUID)
        props.onUpdateFormulary()
    }

    /**
     * This function is used when the user wants to remove a field from the multi_field field. 
     * For that we just filter the field uuid out of the multi_field and then we update the formulary.
     * 
     * @param {string} fieldUuid - The uuid of the field that we want to remove.
     */
    function onRemoveField(fieldData) {
        const newMultiFieldFields = props.field.multiFieldsField.fields.filter(field => field.uuid !== fieldData.uuid)
        props.field.multiFieldsField.fields = newMultiFieldFields
        props.onUpdateFormulary()
    }

    function onDuplicateField(fieldUUID, newField) {
        const fieldIndexInFormulary = props.field.multiFieldsField.fields.findIndex(field => field.uuid === fieldUUID)
        const doesExistFieldIndexInFormulary = fieldIndexInFormulary !== -1
        
        if (doesExistFieldIndexInFormulary) {
            const allFields = retrieveFields()
            const fieldLabelNames = allFields.map(field => field.label.name)
            const copyNumber = 0
            
            while (fieldLabelNames.includes(newField.label.name)) {
                let duplicatedFieldLabelName = `${newField.label.name} ${strings('formularyCopyFieldLabel')}`
                if (copyNumber > 0) {
                    duplicatedFieldLabelName = `${duplicatedFieldLabelName} ${copyNumber}`
                }
                newField.label.name = duplicatedFieldLabelName
                copyNumber++
            }

            props.field.multiFieldsField.fields.splice(fieldIndexInFormulary + 1, 0, newField)
            setNewFieldUUID(newField.uuid)
        }
    }

    function onDuplicateMultiFieldsField(newField) {

    }

    /**
     * If the field is not an attachment, or at least it has just been changed to an attachment, then we need to create the
     * attachment field data. This data will be used to configure the `attachment` field type with custom data.
     */
     function onDefaultCreateMultiFieldsOptionsIfDoesNotExist() {
        const doesFieldMultiFieldsDataExists = typeof field.multiFields === 'object' && ![null, undefined].includes(field.multiFields)
        if (doesFieldMultiFieldsDataExists === false) {
            field.multiFields = createMultiFieldsFieldData()
            setField(field)
            onChangeField(field, ['attachmentField'])
        }
    }

    useEffect(() => {
        const doesRegisterRetrieveFieldsCallbackDefined = ![null, undefined].includes(props.registerRetrieveFieldsCallback) &&
            typeof props.registerRetrieveFieldsCallback === 'function'
        if (doesRegisterRetrieveFieldsCallbackDefined) {
            const fieldUUID = props.field.uuid
            props.registerRetrieveFieldsCallback(fieldUUID, retrieveFieldsOfMultiFieldCallback)
        }
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
}