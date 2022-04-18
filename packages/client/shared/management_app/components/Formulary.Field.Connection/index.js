import { useConnectionField } from '../../hooks'
import Layout from './layouts'

export default function FormularyFieldConnection(props) {
    const {
        formularyToSelectOptions,
        onChangeFormularyAppUUID,
        fieldToSelectOptions,
        onChangeFieldAsOptionUUID,
        isEditingField,
        onToggleEditMode,
        isSelectConnectionValueOpen,
        setIsSelectConnectionValueOpen
    } = useConnectionField(props.field, props.onChangeField, props.registerOnDuplicateOfField)

    return (
        <Layout
        isSelectConnectionValueOpen={isSelectConnectionValueOpen}
        setIsSelectConnectionValueOpen={setIsSelectConnectionValueOpen}
        isEditingField={isEditingField}
        onToggleEditMode={onToggleEditMode}
        fieldToSelectOptions={fieldToSelectOptions}
        onChangeFieldAsOptionUUID={onChangeFieldAsOptionUUID}
        formularyToSelectOptions={formularyToSelectOptions}
        onChangeFormularyAppUUID={onChangeFormularyAppUUID}
        types={props.types}
        field={props.field}
        />
    )
}
