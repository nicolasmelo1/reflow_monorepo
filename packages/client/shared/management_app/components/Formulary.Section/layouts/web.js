import FormularyField from '../../Formulary.Field'

export default function FormularySectionWebLayout(props) {
    return (
        <div>
            <h1>
                {props.section.labelName}
            </h1>
            {props.section.fields.map(field => (
                <FormularyField
                key={field.uuid}
                field={field}
                />
            ))}
        </div>
    )
}