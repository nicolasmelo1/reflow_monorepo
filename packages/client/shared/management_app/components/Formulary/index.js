import { useState, useEffect, useRef, useContext } from 'react'
import axios from 'axios'
import managementAppAgent from '../../agent'
import { FormularyContext } from '../../contexts'
import Layout from './layouts'
import { APP } from '../../../conf'
import { deepCopy } from '../../../../../shared/utils'

export default function Formulary(props) {
    const sourceRef = useRef()
    const formularyFieldsCacheRef = useRef([])
    const isToRecalculateFormularyFieldsRef = useRef(true)
    const formularyContainerRef = useRef()
    const { state: { formulary }, setFormulary, retrieveFromPersist } = useContext(FormularyContext)
    const [formularyContainerOffset, setFormularyContainerOffset] = useState(0)

    /**
     * Probably by now you already know what is passing a value by reference and pass by value. Objects, and arrays
     * are always passed by reference and not by value, so this means we can pass the value as reference and update the
     * value in the children. When we update the value in the children we are updating the actual value of the object.
     * This means it is simple to update the value, even for nested values.
     * 
     * Here for further understanding:
     * https://www.google.com/url?sa=i&url=https%3A%2F%2Fstackoverflow.com%2Fquestions%2F43826922%2Fif-java-is-pass-by-value-then-why-can-we-change-the-properties-of-objects-in-me&psig=AOvVaw3Pln8znHHN39RJWWQSoaqx&ust=1642467147354000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCKC08ojJt_UCFQAAAAAdAAAAABAD
     */
    function onUpdateFormulary() {
        isToRecalculateFormularyFieldsRef.current = true
        setFormulary(props.app.uuid, formulary)
    }

    function retrieveFields() {
        if (isToRecalculateFormularyFieldsRef.current === true) {
            const fields = []
            for (const section of formulary.sections) {
                for (const field of section.fields) {
                    const copiedField = deepCopy(field)
                    copiedField.section = deepCopy(section)
                    fields.push(copiedField)
                }
            }
            formularyFieldsCacheRef.current = fields
        }
        return formularyFieldsCacheRef.current
    }

    useEffect(() => {
        sourceRef.current = axios.CancelToken.source()
        if (APP === 'web') {
            const isFormularyContainerRefDefined = ![null, undefined].includes(formularyContainerRef.current)
            if (isFormularyContainerRefDefined) {
                const yPositionOfFormularyContainer = formularyContainerRef.current.getBoundingClientRect().y
                if (yPositionOfFormularyContainer !== formularyContainerOffset) setFormularyContainerOffset(yPositionOfFormularyContainer)
            }
        }

        return () => {
            if (sourceRef.current) {
                sourceRef.current.cancel()
            }
        }
    }, [])  

    useEffect(() => {
        const isAppDefined = ![null, undefined].includes(props.app) && typeof props.app.uuid === 'string'
        const isWorkspaceUUIDDefined = ![null, undefined].includes(props.workspace) && typeof props.workspace.uuid === 'string'
        
        if (isAppDefined && isWorkspaceUUIDDefined) {
            managementAppAgent.getFormulary(sourceRef.current, props.workspace.uuid, props.app.uuid).then(response => {
                if (response && response.status === 200) {
                    if (response.data.data !== null) {
                        setFormulary(props.app.uuid, response.data.data)
                    }
                } else {
                    retrieveFromPersist(props.app.uuid)
                }
            }).catch(e => {
                retrieveFromPersist(props.app.uuid)
            })
        }
    }, [props.workspace, props.app]) 

    return (
        <Layout
        formularyContainerRef={formularyContainerRef}
        formularyContainerOffset={formularyContainerOffset}
        workspace={props.workspace}
        app={props.app}
        formulary={formulary}
        retrieveFields={retrieveFields}
        onUpdateFormulary={onUpdateFormulary}
        />
    )
}