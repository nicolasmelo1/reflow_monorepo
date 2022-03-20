import { Fragment } from 'react'
import FormularyField from '../../Formulary.Field'
import FormularyAddField from '../../Formulary.AddField'

export default function FormularySectionWebLayout(props) {
    return (
        <div>
            <h1>
                {props.section.labelName}
            </h1>
            <FormularyAddField
            fieldTypes={props.fieldTypes}
            onAddField={(fieldData) => props.onAddField(fieldData, 0)}
            />
            {props.section.fields.map((field, index) => (
                <Fragment
                key={field.uuid}
                >
                    <FormularyField
                    retrieveFieldsCallbacksRef={props.retrieveFieldsCallbacksRef}
                    field={field}
                    isNewField={props.newFieldUUID === field.uuid}
                    onUpdateFormulary={props.onUpdateFormulary}
                    onRemoveField={props.onRemoveField}
                    onDuplicateField={props.onDuplicateField}
                    retrieveFields={props.retrieveFields}
                    />
                    <FormularyAddField
                    fieldTypes={props.fieldTypes}
                    onAddField={(fieldData) => props.onAddField(fieldData, index + 1)}
                    />
                </Fragment>
            ))}
        </div>
    )
}