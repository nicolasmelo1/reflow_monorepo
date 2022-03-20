import { useEffect } from 'react'
import Layout from './layouts'

export default function FormularyFieldMultiField(props) {
    function retrieveFields() {
        return props.field.multiFieldsField.fields
    }

    useEffect(() => {
        const doesRetrieveFieldsCallbacksRefDefined = ![null, undefined].includes(props.retrieveFieldsCallbacksRef) &&
            typeof props.retrieveFieldsCallbacksRef === 'object' && typeof props.retrieveFieldsCallbacksRef.current === 'object'
        if (doesRetrieveFieldsCallbacksRefDefined) {
            const fieldUUId = props.field.uuid
            props.retrieveFieldsCallbacksRef.current[fieldUUId] = retrieveFields
        }
    }, [])
    
    return (
        <Layout
        field={props.field}
        retrieveFields={props.retrieveFields}
        onUpdateFormulary={props.onUpdateFormulary}
        />
    )
}