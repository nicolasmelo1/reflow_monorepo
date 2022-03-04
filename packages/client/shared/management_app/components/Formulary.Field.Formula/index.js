import { useRef } from 'react'
import Layout from './layouts'

//const defaultDelay = delay(1000)

export default function FormularyFieldFormula(props) {
    const codeEditorFunctionsRef = useRef({})

    function onChangeFormula(newFormula) {

    }

    return (
        <Layout
        codeEditorFunctionsRef={codeEditorFunctionsRef}
        onChangeFormula={onChangeFormula}
        types={props.types}
        field={props.field}
        />
    )
}
