import { useFlow } from '../../../flow'
import Layout from './layouts'

export default function FormularyFieldFormula(props) {
    const { editorRef } = useFlow(onChange)

    function onChange(text) {
        console.log(text)
    }
    return (
        <Layout
        editorRef={editorRef}
        types={props.types}
        field={props.field}
        />
    )
}
