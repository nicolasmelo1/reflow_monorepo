import { useFieldTypes } from '../../hooks'
import Layout from './layouts'

/**
 * This component is a really simple and useful component for retrieving the icons of the fields, since we might do 
 * and need the icons in many places and we have too many field types, having this logic in a separated
 * component will help with the mantenability and to add new features to it.
 * 
 * @param {object} props - The props that this component recieves
 * @param {number} fieldTypeId - The id of the field type to get the icon for.
 * 
 * @returns {import('react').ReactElement} - Returns a react component to be rendered.
 */
export default function FieldTypeIcon(props) {
    const { getTypesById } = useFieldTypes()

    return (
        <Layout
        fieldTypeName={getTypesById()[props.fieldTypeId]?.name}
        />
    )
}