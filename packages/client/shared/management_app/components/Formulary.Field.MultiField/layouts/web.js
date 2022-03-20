import FormularyField from '../../Formulary.Field'

export default function FormularyFieldMultiFieldWebLayout(props) {
    const fieldsInside = props.field.multiFieldsField.fields
    return (
        <div>
            {fieldsInside.map(fieldInside => (
                <FormularyField
                key={fieldInside.uuid}
                retrieveFields={props.retrieveFields}
                onUpdateFormulary={props.onUpdateFormulary}
                field={fieldInside}
                />
            ))}
        </div>
    )
}