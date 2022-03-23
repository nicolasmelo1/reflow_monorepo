import { useState, useEffect, useContext, useRef } from 'react'
import { AppManagementTypesContext } from '../../contexts'
import { generateUUID } from '../../../../../shared/utils'
import Layout from './layouts'

export default function FormularyFieldMultiField(props) {
    const [sections, setSections] = useState([])
    const [newFieldUUID, setNewFieldUUID] = useState(null)
    const [activeSectionUUID, setActiveSectionUUID] = useState(null)
    const { state: { types: { fieldTypes } } } = useContext(AppManagementTypesContext)
    const fieldTypesRef = useRef([])
    const hasFieldTypesChangedRef = useRef(true)

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
    function retrieveFields() {
        return props.field.multiFieldsField.fields
    }

    function onAddSection() {
        const newSection = {
            uuid: generateUUID(),
            values: []
        } 
        setSections([newSection,...sections])
    }

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
    function onRemoveField(fieldUUID) {
        const newMultiFieldFields = props.field.multiFieldsField.fields.filter(field => field.uuid !== fieldUUID)
        props.field.multiFieldsField.fields = newMultiFieldFields
        props.onUpdateFormulary()
    }

    useEffect(() => {
        const doesRetrieveFieldsCallbacksRefDefined = ![null, undefined].includes(props.retrieveFieldsCallbacksRef) &&
            typeof props.retrieveFieldsCallbacksRef === 'object' && typeof props.retrieveFieldsCallbacksRef.current === 'object'
        if (doesRetrieveFieldsCallbacksRefDefined) {
            const fieldUUId = props.field.uuid
            props.retrieveFieldsCallbacksRef.current[fieldUUId] = retrieveFields
        }
    }, [])

    useEffect(() => {
        hasFieldTypesChangedRef.current = true
        getFieldTypes()
    }, [fieldTypes])
    
    return (
        <Layout
        sections={sections}
        field={props.field}
        fieldTypes={getFieldTypes()}
        onAddSection={onAddSection}
        onRemoveSection={onRemoveSection}
        onAddField={onAddField}
        onRemoveField={onRemoveField}
        activeSectionUUID={activeSectionUUID}
        newFieldUUID={newFieldUUID}
        retrieveFields={props.retrieveFields}
        onUpdateFormulary={props.onUpdateFormulary}
        />
    )
}