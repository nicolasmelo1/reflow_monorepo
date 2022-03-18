import { useFieldTypes } from '../../hooks'
import Layout from './layouts'

export default function FieldTypeIcon(props) {
    const { getTypesById } = useFieldTypes(props.types)

    return (
        <Layout
        fieldTypeName={getTypesById()[props.fieldTypeId]?.name}
        />
    )
}