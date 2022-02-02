import FormularyField from '../../Formulary.Field'

export default function FormularySectionWebLayout(props) {
    return (
        <div>
            <h1>
                {props.section.labelName}
            </h1>
            {props.section.fields.map(field => (
                <FormularyField
                formularyContainerRef={props.formularyContainerRef}
                key={field.uuid}
                workspace={props.workspace}
                field={field}
                onUpdateFormulary={props.onUpdateFormulary}
                onRemoveField={props.onRemoveField}
                onDuplicateField={props.onDuplicateField}
                />
            ))}
        </div>
    )
}