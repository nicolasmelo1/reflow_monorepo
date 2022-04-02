import { useState, useEffect, useContext, useRef } from 'react'
import { AppManagementTypesContext } from '../../contexts'
import { generateUUID } from '../../../../../shared/utils'
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
        registerOnDeleteOfFieldFromMultiFieldsField,
        registerOnDuplicateOfFieldFromMultiFieldsField
    } = useMultiFieldsField(
        props.field, props.onChangeFieldConfiguration, 
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
        registerOnDeleteOfFieldFromMultiFieldsField={registerOnDeleteOfFieldFromMultiFieldsField}
        registerOnDuplicateOfFieldFromMultiFieldsField={registerOnDuplicateOfFieldFromMultiFieldsField}
        activeSectionUUID={activeSectionUUID}
        newFieldUUID={newFieldUUID}
        retrieveFields={props.retrieveFields}
        onUpdateFormulary={props.onUpdateFormulary}
        />
    )
}