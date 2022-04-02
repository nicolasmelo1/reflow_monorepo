import { Fragment } from 'react'
import FormularyField from '../../Formulary.Field'
import FormularyAddField from '../../Formulary.AddField'
import Styled from '../styles'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

export default function FormularyFieldMultiFieldWebLayout(props) {
    const fieldsInside = props.field.multiFieldsField.fields

    return (
        <div>
            <div style={{display: 'none'}}>
                {fieldsInside.map(fieldInside => (
                    <FormularyField
                    key={fieldInside.uuid}
                    retrieveFields={props.retrieveFields}
                    onRemoveField={props.onRemoveField}
                    onUpdateFormulary={props.onUpdateFormulary}
                    field={fieldInside}
                    registerOnDeleteOfField={props.registerOnDeleteOfFieldFromMultiFieldsField}
                    registerOnDuplicateOfField={props.registerOnDuplicateOfFieldFromMultiFieldsField}
                    />
                ))}
            </div>
            <Styled.AddButton
            onClick={() => props.onAddSection()}
            hasSections={props.sections.length > 0}
            >
                {'Adicionar'}
            </Styled.AddButton>
            {props.sections.map((section, index) => (
                <Styled.SectionContainer 
                key={section.uuid}
                isLast={index === props.sections.length - 1}
                >
                    <Styled.RemoveButton
                    onClick={() => props.onRemoveSection(section.uuid)}
                    >
                        <Styled.RemoveButtonIcon
                        icon={faTrash}
                        />
                    </Styled.RemoveButton>
                    <FormularyAddField
                    fieldTypes={props.fieldTypes}
                    onAddField={(fieldTypeId) => props.onAddFieldFromMultiFieldsField(fieldTypeId, 0, section.uuid)}
                    />
                    {fieldsInside.map((fieldInside, index) => (
                        <Fragment
                        key={fieldInside.uuid}
                        >
                            <FormularyField
                            retrieveFields={props.retrieveFields}
                            onRemoveField={props.onRemoveFieldFromMultiFieldsField}
                            onDuplicateField={props.onDuplicateFieldFromMultiFieldsField}
                            onUpdateFormulary={props.onUpdateFormulary}
                            isNewField={
                                fieldInside.uuid === props.newFieldUUID && 
                                props.activeSectionUUID === section.uuid
                            }
                            field={fieldInside}
                            registerOnDeleteOfField={props.registerOnDeleteOfFieldFromMultiFieldsField}
                            registerOnDuplicateOfField={props.registerOnDuplicateOfFieldFromMultiFieldsField}
                            />
                            <FormularyAddField
                            fieldTypes={props.fieldTypes}
                            onAddField={(fieldTypeId) => props.onAddFieldFromMultiFieldsField(fieldTypeId, index + 1, section.uuid)}
                            />
                        </Fragment>
                    ))}
                </Styled.SectionContainer>
            ))}
        </div>
    )
}