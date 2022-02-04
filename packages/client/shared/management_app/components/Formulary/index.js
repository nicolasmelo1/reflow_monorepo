import { useEffect, useRef, useContext } from 'react'
import axios from 'axios'
import managementAppAgent from '../../agent'
import { FormularyContext } from '../../contexts'
import Layout from './layouts'

export default function Formulary(props) {
    const sourceRef = useRef()
    const formularyContainerRef = useRef()
    const { state: { formulary }, setFormulary, retrieveFromPersist } = useContext(FormularyContext)

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
        setFormulary(props.app.uuid, formulary)
    }

    useEffect(() => {
        sourceRef.current = axios.CancelToken.source()
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
        workspace={props.workspace}
        app={props.app}
        formulary={formulary}
        onUpdateFormulary={onUpdateFormulary}
        />
    )
}