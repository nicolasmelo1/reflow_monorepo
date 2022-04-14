import { useRef, useState, useEffect, useContext } from 'react' 
import axios from 'axios'
import useFieldTypes from './useFieldTypes'
import { generateUUID } from '../../../../shared/utils'
import { AreaContext } from '../../home/contexts'
import { WorkspaceContext } from '../../authentication/contexts'
import { AppManagementTypesContext, FormularyContext } from '../contexts'
import managementAppAgent from '../agent'


export default function useConnectionField(
    fieldData, onChangeFieldData, registerOnDuplicateOfField
) {
    const [formularyToSelectOptions, setFormularyToSelectOptions] = useState([])
    const [fieldToSelectOptions, setFieldToSelectOptions] = useState([])

    const { setFormulary, retrieveFromPersist: retrieveFormularyDataFromPersist } = useContext(FormularyContext)
    const { state: { selectedWorkspace }} = useContext(WorkspaceContext)
    const { areas, recursiveTraverseAreas } = useContext(AreaContext)
    const { state: { types: { fieldTypes }}} = useContext(AppManagementTypesContext)

    const { getTypesById } = useFieldTypes()
    const fieldRef = useRef(fieldData)
    const sourceRef = useRef(null)
    const cachedAreasRef = useRef(areas)

    /**
     * This is used to create the connection data for the `connection` field type.
     * The data for this field type are the id of the formulary of the field to use
     * as option. In other words what we do is this:
     * 
     * Instead of showing all of the data for the options we aggregate all of them in a simple
     * from a single value.
     * 
     * @param {object} connectionFieldData - The data needed for the `connection` field type.
     * @param {string|null} [connectionFieldData.formularyAppUUID=null] - The app uuid of the formulary of the 
     * `fieldAsOptionId`. By default we don't aggregate all of the informations of the records. Instead we just 
     * show the values of a particular field.
     * @param {string|null} [connectionFieldData.fieldAsOptionUUID=null] - The field uuid to use as option
     * for this connection field type. What this does is that this gets the uuid of the field to use as option
     * and then displays the values of this field as the options that the user is able to select.
     * 
     * @returns {{
     *      uuid: string,
     *      formularyAppUUID: formularyAppUUID,
     *      fieldAsOptionUUID: fieldAsOptionUUID
     * }} - Returns the object for the `connectionField` data of the `field` object
     */
    function createConnectionFieldData({
        formularyAppUUID=null,
        fieldAsOptionUUID=null
    }={}) {
        return {
            uuid: generateUUID(),
            formularyAppUUID,
            fieldAsOptionUUID
        }
    }
    
    /**
     * This will retrieve all of the options for the user so he can select the formulary of the
     * fields.
     */
    async function retrieveAllOfTheFormularyOptions() {
        const optionsThatTheUserCanSelectForTheFormulary = []
        await recursiveTraverseAreas((area) => {
            area.apps.forEach(app => {
                const isAppAManagementApp = app?.selectedApp?.name === 'reflow_management'
                if (isAppAManagementApp) {
                    optionsThatTheUserCanSelectForTheFormulary.push({
                        value: app.uuid,
                        label: app.labelName
                    })
                }
            })
            return false
        })
        setFormularyToSelectOptions(optionsThatTheUserCanSelectForTheFormulary)
    }

    /**
     * This is divided on two parts: 
     * 
     * - First we need to know if the formulary data exists in the persist storage (this way we don't need
     * to call the api to retrive the data to it again). Yep, the data of the formulary might not be in sync
     * with the server but we will create webhooks to sync the local and the server so usually retrieving
     * from the persist storage is the best solution.
     * - Sometimes the formulary does not exist in the persist storage. In this case we will retrieve this formulary
     * data. This is really helpful since we can probably prevent calling the api again another time. For example,
     * let's imagine the `Sales Funnel` is connected to `Clients`, the `Sales Funnel` was loaded first, the `Clients`
     * wasn't. But since `Sales Funnel` is connected to `Clients` we will load the `Clients` data. So when we open 
     * the `Clients` formulary it will already be loaded.
     */
    async function retrieveAllOfTheFieldAsOptionOptions() {
        /**
         * This will traverse all of the fields of a formularyData object and then it will update the 
         * `fieldToSelectOptions` state.
         * Those options are the fields that the user can select to show on the dropdown menu. 
         * In other words:
         * The `connection` fieldType is a simple `Select`, each option in this `Select` 
         * refers to a value inserted to a field.
         * This field where we get the values for is what we define here. For example, suppose 
         * that we are connected to `Clients`
         * but on `Clients` we have the `Name of Client`, `age`, `Birthday` and `Email`. 
         * So suppose we select the `Name of Client` as the fieldAsOption, then the user will be
         * able to see the `Name of Client` records values from the dropdown menu.
         * 
         * Right now we cannot connect directly the following: 'connection', 'multi_field', 'attachment', 'tags'
         * 
         * @param {Array<{
         *      uuid: string,
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
         * }>} formularyFields - The fields of the formulary that you want to traverse
         */
        function traverseAllFieldsOfTheFormularyAndUpdateState(formularyFields) {
            const invalidFieldsTypesToConnectTo = ['connection', 'multi_field', 'attachment', 'tags']
            const fieldTypesById = getTypesById()
            const fieldAsOptionOptions = []

            formularyFields.forEach(field => {
                const doesFieldTypeExist = ![null, undefined].includes(fieldTypesById[field.fieldTypeId])
                if (doesFieldTypeExist) {
                    const fieldTypeName = fieldTypesById[field.fieldTypeId].name
                    const isFieldTypeOfFieldAbleToBeUsedAsOption = !invalidFieldsTypesToConnectTo.includes(fieldTypeName)
                    if (isFieldTypeOfFieldAbleToBeUsedAsOption) {
                        fieldAsOptionOptions.push({
                            value: field.uuid,
                            label: field.label.name
                        })
                    }
                }
            })
            setFieldToSelectOptions(fieldAsOptionOptions)
        }

        const formularyAppUUID = fieldRef.current.connectionField.formularyAppUUID
        const formularyDataFromPersist = await retrieveFormularyDataFromPersist(formularyAppUUID, false)
        const doesFormularyDataFromPersistExists = typeof formularyDataFromPersist === 'object' && 
            ![null, undefined].includes(formularyDataFromPersist)
        
        if (doesFormularyDataFromPersistExists) {
            traverseAllFieldsOfTheFormularyAndUpdateState(formularyDataFromPersist.formulary.fields)
        } else {
            try {
                const response = await managementAppAgent.getFormulary(
                    sourceRef.current, selectedWorkspace.uuid, formularyAppUUID
                )
                const isAValidResponse = response && response.status === 200
                if (isAValidResponse) {
                    setFormulary(formularyAppUUID, response.data.data, false)
                    traverseAllFieldsOfTheFormularyAndUpdateState(response.data.data.formulary.fields)
                } else {
                    setFieldToSelectOptions([])
                }
            } catch (e) {
                setFieldToSelectOptions([])
            }
        }
    }

    /**
     * Handy function used to update the internal and external state of the field data at the same time.
     * 
     * @param {object} newFieldData - The new data of the field.
     */
    function onChangeField(newFieldData) {
        onChangeFieldData(newFieldData)
        fieldRef.current = newFieldData
    }

    /**
     * This is used to register the field option, this is the field that we want to use as option for
     * the select input of the connection field.
     * 
     * In other words, the values present on this field will be the options that the user can select.
     * 
     * @param {string} fieldAsOptionUUID - The uuid of the field to use as option.
     */
    function onChangeFieldAsOptionUUID(fieldAsOptionUUID) {
        const isConnectionFieldObjectDefined = typeof fieldRef.current.connectionField === 'object' &&
            ![null, undefined].includes(fieldRef.current.connectionField)
            
        if (isConnectionFieldObjectDefined) {
            fieldRef.current.connectionField.fieldAsOptionUUID = fieldAsOptionUUID
        } else {
            fieldRef.current.connectionField = createConnectionFieldData({ fieldAsOptionUUID })
        }
        onChangeField({...fieldRef.current})
    }

    function onChangeFormularyAppUUID(formularyAppUUID) {
        const isConnectionFieldObjectDefined = typeof fieldRef.current.connectionField === 'object' &&
            ![null, undefined].includes(fieldRef.current.connectionField)
        if (isConnectionFieldObjectDefined) {
            fieldRef.current.connectionField.formularyAppUUID = formularyAppUUID
        } else {
            fieldRef.current.connectionField = createConnectionFieldData({ formularyAppUUID })
        }
        retrieveAllOfTheFieldAsOptionOptions()
        onChangeField({...fieldRef.current})
    }

    /**
     * This is called whenever the field is duplicated.
     * 
     * @param {object} newField - The new field that was duplicated.
     */
    function onDuplicateField(newField) {
        const doesConnectionFieldExist = typeof newField.connectionField === 'object' && 
            ![null, undefined].includes(newField.connectionField)
        if (doesConnectionFieldExist) newField.connectionField.uuid = generateUUID()
        else newField.connectionField = createConnectionFieldData()
    }

    /**
     * When the `connection` field type was just created or if for some other reason the field does not have
     * `connection` specific data, we will create the data by default when the field is created.
     * 
     * This `connection` field data is a specific object that holds information specific for the `connection` 
     * field type.
     */
    function onDefaultCreateConnectionOptionsIfDoesNotExist() {
        const doesFieldConnectionDataExists = typeof fieldRef.current.connectionField === 'object' && 
            ![null, undefined].includes(fieldRef.current.connectionField)
        if (doesFieldConnectionDataExists === false) {
            fieldRef.current.connectionField = createConnectionFieldData()
            onChangeField(fieldRef.current)
        }
    }

    useEffect(() => {
        sourceRef.current = axios.CancelToken.source()

        registerOnDuplicateOfField(onDuplicateField)
        retrieveAllOfTheFormularyOptions()
        onDefaultCreateConnectionOptionsIfDoesNotExist()

        return () => {
            if (sourceRef.current) {
                sourceRef.current.cancel()
            }
        }
    }, [])

    /**
     * When the external field changes we should also change the internal field value.
     */
    useEffect(() => {
        const isFieldDifferentFromFieldData = JSON.stringify(fieldData) !== JSON.stringify(fieldRef.current)
        if (isFieldDifferentFromFieldData) {
            fieldRef.current = fieldData
        }
    }, [fieldData])

     /**
     * This is used to see if the areas have changed, if the areas changed then we will reload the options
     * that the user can select again.
     */
    useEffect(() => {
        const isCachedAreasDifferentFromAreas = JSON.stringify(areas) !== JSON.stringify(cachedAreasRef.current)
        if (isCachedAreasDifferentFromAreas) {
            cachedAreasRef.current = areas
            retrieveAllOfTheFormularyOptions()
        }
    }, [areas])

    return {
        fieldToSelectOptions,
        formularyToSelectOptions,
        onChangeFormularyAppUUID,
        onChangeFieldAsOptionUUID
    }
}