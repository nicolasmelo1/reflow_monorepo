import { useState, useContext } from 'react'
import { generateUUID, deepCopy } from '../../../../../shared/utils'
import { AppManagementTypesContext } from '../../contexts'
import Layout from './layouts'

export default function FormularySection(props) {
    const { state: { types: { fieldTypes } } } = useContext(AppManagementTypesContext)
    const [newFieldUUID, setNewFieldUUID] = useState(null)

    /**
     * Used for adding a new field to the section. The data and logic for adding a new field is defined on `Formulary.AddField` component.
     * This just recieves the data and the index of where the field should be added to the section.
     * 
     * After that we change the `newFieldUUID` so we can have a special behavior for the field that is being added. For example, the renaming
     * and the configuration of the field will be shown.
     * 
     * @param {object} fieldData - The data of the field that is being added.
     * @param {number} indexToAdd - The index of where the field should be added to the section.
     * 
     */
    function onAddField(fieldData, indexToAdd) {
        fieldData.order = indexToAdd
        props.section.fields.splice(indexToAdd, 0, fieldData)
        setNewFieldUUID(fieldData.uuid)
        props.onUpdateFormulary()
    }

    /**
     * Used for duplicating the field and creating a new field with the same properties in the section.
     * To duplicate the field it is easy, we just need to create new UUIDs for the options, and the field options.
     * By generating new UUIDs we are able to create a new field with the exact same properties as an old field.
     * 
     * @param {string} fieldUUID - The uuid of the field that we want to duplicate.
     */
    function onDuplicateField(fieldUUID) {
        const fieldIndexInSection = props.section.fields.findIndex(field => field.uuid === fieldUUID)
        if (fieldIndexInSection !== -1) {
            const newField = deepCopy(props.section.fields[fieldIndexInSection])
            newField.uuid = generateUUID()
            newField.options = newField.options.map(option => { 
                option.uuid = generateUUID()
                return option
            })
            if (![null, undefined].includes(newField.connectionField)) newField.connectionField.uuid = generateUUID()
            if (![null, undefined].includes(newField.userField)) newField.userField.uuid = generateUUID()
            if (![null, undefined].includes(newField.numberField)) newField.numberField.uuid = generateUUID()
            if (![null, undefined].includes(newField.dateField)) newField.dateField.uuid = generateUUID()
            if (![null, undefined].includes(newField.formulaField)) newField.formulaField.uuid = generateUUID()
            props.section.fields.splice(fieldIndexInSection + 1, 0, newField)
            props.onUpdateFormulary(props.formulary)
        }
    }

    /**
     * This function is used when the user wants to remove a field from the formulary. For that we just filter the field
     * uuid out of the section and then we update the formulary.
     * 
     * @param {string} fieldUuid - The uuid of the field that we want to remove.
     */
    function onRemoveField(fieldUUID) {
        const newSectionFields = props.section.fields.filter(field => field.uuid !== fieldUUID)
        props.section.fields = newSectionFields
        props.onUpdateFormulary()
    }

    return (
        <Layout
        formularyContainerRef={props.formularyContainerRef}
        workspace={props.workspace}
        section={props.section}
        onUpdateFormulary={props.onUpdateFormulary}
        fieldTypes={fieldTypes}
        onAddField={onAddField}
        newFieldUUID={newFieldUUID}
        onRemoveField={onRemoveField}
        onDuplicateField={onDuplicateField}
        retrieveFields={props.retrieveFields}
        />
    )
}