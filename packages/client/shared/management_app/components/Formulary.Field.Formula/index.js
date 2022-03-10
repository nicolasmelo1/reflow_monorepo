import { useRef } from 'react'
import { delay } from '../../../../../shared/utils'
import Layout from './layouts'

const defaultDelay = delay(2000)

export default function FormularyFieldFormula(props) {
    const evaluateRef = useRef(null)

    function onChangeFormula(newFormula) {
        defaultDelay(() => {
            evaluateRef.current(newFormula).then(async result => {
                if (result !== undefined && result._representation_ !== undefined) {
                    const realResult = await(await result._string_())._representation_()
                    console.log(realResult)
                }
            })
        })
    }

    return (
        <Layout
        evaluateRef={evaluateRef}
        onChangeFormula={onChangeFormula}
        types={props.types}
        field={props.field}
        />
    )
}
