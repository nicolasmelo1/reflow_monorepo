import { APP } from '../../../conf'
import { useState, useEffect, useRef, useContext } from 'react'
import axios from 'axios'
import managementAppAgent from '../../agent'
import { AppManagementTypesContext, FormularyContext } from '../../contexts'
import { strings } from '../../../core'
import { deepCopy } from '../../../../../shared/utils'
import Layout from './layouts'

export default function Formulary(props) {
    const sourceRef = useRef()
    const retrieveFieldsCallbacksRef = useRef({})
    const formularyFieldsCacheRef = useRef([])
    const isToRecalculateFormularyFieldsRef = useRef(true)
    const formularyContainerRef = useRef()
    
    const { state: { formulary }, setFormulary, retrieveFromPersist } = useContext(FormularyContext)
    const { state: { types: { fieldTypes } } } = useContext(AppManagementTypesContext)
    
    const [formularyContainerOffset, setFormularyContainerOffset] = useState(0)
    const [newFieldUUID, setNewFieldUUID] = useState(null)

    /**
     * Used for adding a new field to the formulary. The data and logic for adding a new field is defined on `Formulary.AddField` component.
     * This just recieves the data and the index of where the field should be added to the formulary.
     * 
     * After that we change the `newFieldUUID` so we can have a special behavior for the field that is being added. For example, the renaming
     * and the configuration of the field will be shown.
     * 
     * @param {object} fieldData - The data of the field that is being added.
     * @param {number} indexToAdd - The index of where the field should be added to the formulary.
     */
    function onAddField(fieldData, indexToAdd) {
        fieldData.order = indexToAdd
        formulary.fields.splice(indexToAdd, 0, fieldData)
        setNewFieldUUID(fieldData.uuid)
        onUpdateFormulary()
    }

    /**
     * Used for duplicating the field and creating a new field with the same properties in the formulary.
     * To duplicate the field it is easy, we just need to create new UUIDs for the options, and the field options.
     * By generating new UUIDs we are able to create a new field with the exact same properties as an old field.
     * 
     * @param {string} fieldUUID - The uuid of the field that we want to duplicate.
     * @param {object} fieldData - The new field data that is being duplicated.
     */
    function onDuplicateField(fieldUUID, newField) {
        const fieldIndexInFormulary = formulary.fields.findIndex(field => field.uuid === fieldUUID)
        const doesExistFieldIndexInFormulary = fieldIndexInFormulary !== -1
        
        if (doesExistFieldIndexInFormulary) {
            const allFields = retrieveFields()
            const fieldLabelNames = allFields.map(field => field.label.name)
            const copyNumber = 0
            
            while (fieldLabelNames.includes(newField.label.name)) {
                let duplicatedFieldLabelName = `${newField.label.name} ${strings('formularyCopyFieldLabel')}`
                if (copyNumber > 0) {
                    duplicatedFieldLabelName = `${duplicatedFieldLabelName} ${copyNumber}`
                }
                newField.label.name = duplicatedFieldLabelName
                copyNumber++
            }

            formulary.fields.splice(fieldIndexInFormulary + 1, 0, newField)
            setNewFieldUUID(newField.uuid)
            onUpdateFormulary(props.formulary)
        }
    }

    /**
     * This function is used when the user wants to remove a field from the formulary. For that we just filter the field
     * uuid out of the formulary and then we update the formulary.
     * 
     * @param {object} fieldData - The uuid of the field that we want to remove.
     */
    function onRemoveField(fieldData) {
        const newFormularyFields = formulary.fields.filter(field => field.uuid !== fieldData.uuid)
        formulary.fields = newFormularyFields
        onUpdateFormulary()
    }

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
     * So how does this work? We pass the `registerRetrieveFieldsCallback` to the fields, if some field has fields in it, 
     * it should register the callback using this function.
     * 
     * So for example in the `multi_fields` component we will have something like: 
     * ```
     * function retrieveFields() {
     *      // code to retrieve the fields here.
     * }
     * 
     * useEffect(() => {
     *      props.registerRetrieveFieldsCallback(props.field.uuid, retrieveFields)
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
     * @returns {Array<{
     *      uuid: string,
     *      name: string,
     *      labelName: string,
     *      labelIsHidden: boolean,
     *      fieldIsHidden: boolean,
     *      fieldTypeId: number,
     *      label: {
     *          name: string
     *      },
     *      isUnique: boolean,
     *      options: Array<{
     *          uuid: string, 
     *          value: string, 
     *          order: number, 
     *          color: string
     *      }>,
     *      placeholder: null | string,
     *      required: boolean
     * }>} - Returns an array of the fields inside of this formulary.
     */
    function retrieveFields() {
        function retrieveNestedFieldsFromFieldsWithFieldsInIt(field, fields) {
            const isFieldWithFieldsInIt = typeof retrieveFieldsCallbacksRef.current[field.uuid] === 'function'
            if (isFieldWithFieldsInIt) {
                const fieldsOfFieldWithFieldsInIt = retrieveFieldsCallbacksRef.current[field.uuid]()
                for (const fieldOfFieldWithFieldsInIt of fieldsOfFieldWithFieldsInIt) {
                    const copiedFieldOfFieldWithFieldsInIt = deepCopy(fieldOfFieldWithFieldsInIt)
                    fields.push(copiedFieldOfFieldWithFieldsInIt)
                    retrieveNestedFieldsFromFieldsWithFieldsInIt(copiedFieldOfFieldWithFieldsInIt, fields)
                }
            }
        } 

        if (isToRecalculateFormularyFieldsRef.current === true) {
            const fields = []
            for (const field of formulary.fields) {
                const copiedField = deepCopy(field)
                fields.push(copiedField)
                retrieveNestedFieldsFromFieldsWithFieldsInIt(copiedField, fields)
            }
            formularyFieldsCacheRef.current = fields
        }
        return formularyFieldsCacheRef.current
    }

    /**
     * This function is used to register the callback function that will be called to retrieve the fields of a field.
     * For example, `multi_fields` field type has fields in it. So when we are retrieving all of the fields of the formulary
     * we need to know how to retrieve those fields. Instead of appending this logic to the formulary (since we can have
     * multiple field types) we keep the logic on the field, so when we pass over this field we retrieve the fields inside of it.
     * 
     * @param {string} fieldUUID - The uuid of the field that has fields in it.
     * @param {() => Array<{
     *      uuid: string,
     *      name: string,
     *      labelName: string,
     *      labelIsHidden: boolean,
     *      fieldIsHidden: boolean,
     *      fieldTypeId: number,
     *      label: {
     *          name: string
     *      },
     *      isUnique: boolean,
     *      options: Array<{
     *          uuid: string, 
     *          value: string, 
     *          order: number, 
     *          color: string
     *      }>,
     *      placeholder: null | string,
     *      required: boolean
     * }>} callback - The function that will be called to retrieve the fields of the field.
     */
    function registerRetrieveFieldsCallback(fieldUUID, callback) {
        retrieveFieldsCallbacksRef.current[fieldUUID] = callback
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
        registerRetrieveFieldsCallback={registerRetrieveFieldsCallback}
        formularyContainerRef={formularyContainerRef}
        formularyContainerOffset={formularyContainerOffset}
        fieldTypes={fieldTypes}
        onAddField={onAddField}
        newFieldUUID={newFieldUUID}
        onRemoveField={onRemoveField}
        onDuplicateField={onDuplicateField}
        onUpdateFormulary={onUpdateFormulary}
        workspace={props.workspace}
        app={props.app}
        formulary={formulary}
        retrieveFields={retrieveFields}
        />
    )
}