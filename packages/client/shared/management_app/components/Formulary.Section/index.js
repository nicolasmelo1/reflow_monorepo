import { generateUUID, deepCopy } from '../../../../../shared/utils'
import Layout from './layouts'

export default function FormularySection(props) {
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
        onRemoveField={onRemoveField}
        onDuplicateField={onDuplicateField}
        retrieveFields={props.retrieveFields}
        />
    )
}