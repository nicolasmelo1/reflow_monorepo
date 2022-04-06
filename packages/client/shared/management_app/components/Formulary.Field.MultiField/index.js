import Layout from './layouts'
import { useMultiFieldsField } from '../../hooks'

export default function FormularyFieldMultiField(props) {
    const {
        sections,
        newFieldUUID,
        activeSectionUUID, 
        onRemoveSection, 
        onAddSection,
        getFieldTypes,
        onAddFieldFromMultiFieldsField,
        onDuplicateFieldFromMultiFieldsField,
        onRemoveFieldFromMultiFieldsField,
        onChangeFieldFromMultiFieldsField,
        registerOnDeleteOfFieldFromMultiFieldsField,
        registerOnDuplicateOfFieldFromMultiFieldsField
    } = useMultiFieldsField(
        props.field, props.onChangeField, 
        props.registerOnDuplicateOfField, props.registerRetrieveFieldsOfField
    )

    return (
        <Layout
        sections={sections}
        field={props.field}
        fieldTypes={getFieldTypes()}
        onAddSection={onAddSection}
        onRemoveSection={onRemoveSection}
        onAddFieldFromMultiFieldsField={onAddFieldFromMultiFieldsField}
        onDuplicateFieldFromMultiFieldsField={onDuplicateFieldFromMultiFieldsField}
        onRemoveFieldFromMultiFieldsField={onRemoveFieldFromMultiFieldsField}
        onChangeFieldFromMultiFieldsField={onChangeFieldFromMultiFieldsField}
        registerOnDeleteOfFieldFromMultiFieldsField={registerOnDeleteOfFieldFromMultiFieldsField}
        registerOnDuplicateOfFieldFromMultiFieldsField={registerOnDuplicateOfFieldFromMultiFieldsField}
        activeSectionUUID={activeSectionUUID}
        newFieldUUID={newFieldUUID}
        retrieveFields={props.retrieveFields}
        onUpdateFormulary={props.onUpdateFormulary}
        />
    )
}