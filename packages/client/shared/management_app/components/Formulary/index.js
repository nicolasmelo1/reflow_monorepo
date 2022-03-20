import { useState, useEffect, useRef, useContext } from 'react'
import axios from 'axios'
import managementAppAgent from '../../agent'
import { FormularyContext } from '../../contexts'
import Layout from './layouts'
import { APP } from '../../../conf'
import { deepCopy } from '../../../../../shared/utils'


export default function Formulary(props) {
    const sourceRef = useRef()
    const retrieveFieldsCallbacksRef = useRef({})
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

    /**
     * Callback used to retrieve all of the field of the formulary. When we retrieve the fields of the formulary
     * we need a way to retrieve those fields tied to a specific field. That's because we, at the current time,
     * has the field type called 'multi_field' which is field that contains other fields.
     * 
     * We don't want to add logic tied to fields here, this means there are 2 ways to do this.
     * 1 - When we find a `multi_fields` we get the fields tied to it. This means that this function should know
     * that `multi_fields` field type has fields. This is a good approach, but this means we are adding logic
     * of fields and how they work outside of the field component
     * 2 - This is what we use. Instead of adding the logic directly here, we give a way for fields to notify
     * they have fields, and when we request the fields again with this function we call the function on the field
     * that has fields in it. It's like: "HEY, are you retrieving fields? I have fields in myself, let me get them for you".
     * 
     * With this generalistic approach we can have the logic needed inside of the fields directly.
     * 
     * So how does this work? We pass the `retrieveFieldsCallbacksRef` to the fields, if some field has fields in it, 
     * it should tie a callback function in this ref that will be called to retrieve the fields.
     * 
     * So for example in the `multi_fields` component we will have something like: 
     * ```
     * function retrieveFields() {
     *      // code to retrieve the fields here.
     * }
     * 
     * useEffect(() => {
     *      props.retrieveFieldsCallbacksRef.current = {
     *          ...props.retrieveFieldsCallbacksRef
     *          [props.field.uuid]: retrieveFields
     *      }
     * }, [])
     * ```
     * 
     * Then the props.retrieveFieldsCallbacksRef.current will look like that:
     * ```
     * {
     *      'd7785a43-ab91-4308-ac40-e6c33b3292ef': () => Array<fields>
     * }
     * ```
     * Supposing that `d7785a43-ab91-4308-ac40-e6c33b3292ef` is the uuid of a multi_field array, this gives access for us to
     * retrieve the fields inside of this field when needed.
     * 
     * @returns {Array<>}
     */
    function retrieveFields() {
        if (isToRecalculateFormularyFieldsRef.current === true) {
            const fields = []
            for (const section of formulary.sections) {
                for (const field of section.fields) {
                    const copiedField = deepCopy(field)
                    copiedField.section = deepCopy(section)
                    fields.push(copiedField)

                    const isFieldWithFieldsInIt = typeof retrieveFieldsCallbacksRef.current[copiedField.uuid] === 'function'
                    if (isFieldWithFieldsInIt) {
                        const fieldsOfFieldWithFieldsInIt = retrieveFieldsCallbacksRef.current[copiedField.uuid]()
                        for (const fieldOfFieldWithFieldsInIt of fieldsOfFieldWithFieldsInIt) {
                            const copiedFieldOfFieldWithFieldsInIt = deepCopy(fieldOfFieldWithFieldsInIt)
                            fields.push(copiedFieldOfFieldWithFieldsInIt)
                        }
                    }
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
        retrieveFieldsCallbacksRef={retrieveFieldsCallbacksRef}
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