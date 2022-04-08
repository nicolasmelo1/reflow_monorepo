import { useRef, useState, useEffect, useContext } from 'react'
import { delay, generateUUID } from '../../../../shared/utils'
import { WorkspaceContext } from '../../authentication/contexts'
import { strings } from '../../core'
import { FormulaFormatOption } from '../components/Formulary.Field.Formula'

const defaultDelay = delay(2000)
const VARIABLE_IN_FORMULA_REGEX = /{{((\s+)?([^\s{}]+(\s+)?)+)?}}/g

/**
 * Hook used for configuring and handling the logic for the formula field type. This field type will calculate the values automatically
 * the user doesn't need to configure and setup anything.
 * 
 * @param {{
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
 *      required: boolean,
 *      formulaField: {
 *          uuid: string,
 *          formula: string,
 *          variables: Array<{
 *              uuid: string, 
 *              variableUUID: string, 
 *              order: number
 *          }>
 *      }
 * }} fieldData - The data of the field that is being edited.
 * @param {(fieldData: object, namespaces: Array<string>) => void} onChangeField - This is the function that is called when the user 
 * changes the value of the field.
 * @param {(component: import('react').ReactElement, props: object) => void} registerComponentForFieldSpecificOptionsForDropdownMenu - 
 * Function used for registering the component inside of the `FieldEditDropdownMenu` component.
 * @param {(callback: (fieldData: object) => void) => void} registerOnDuplicateOfField - Function used for registeing
 * a callback when we duplicate the field.
 * @param {() => Array<{
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
 * }>} retrieveFields - Function used for retrieving the fields that are available in the context. The context is because we have
 * the `multi_field` field type so the context might change and the fields retrieved might change, but by default this returns all 
 * of the fields of the formulary.
 */
export default function useFormulaField(
    fieldData, onChangeFieldData, registerComponentForFieldSpecificOptionsForDropdownMenu, 
    registerOnDuplicateOfField, retrieveFields
) {
    const evaluateRef = useRef(null)
    const flowServiceRef = useRef(null)
    const formularyFieldsRef = useRef([])
    const fieldsByFieldUUIDRef = useRef({})
    
    const { state: { selectedWorkspace: { isAdmin: isUserAnAdmin } } } = useContext(WorkspaceContext)
    const [field, setField] = useState(fieldData)
    const [isEditingFormula, setIsEditingFormula] = useState(false)
    const [formula, setFormula] = useState({
        userFacingFormula: getUserFacingFormula(),
        forBackendFormula: getBackendFormula()
    })

    function onChangeField(newFieldData) {
        setField(newFieldData)
        onChangeFieldData(newFieldData)
    }

    /**
     * THis is used to retrieve all of the fields in the context by their uuid. This makes a cache of the fields so we don't need
     * to regenerate it everytime we need to use it. We only generate a new object when the fields change.
     * 
     * @returns {object} - The fields in the context by their uuid.
     */
    function getFieldsByFieldUUID() {
        const formularyFields = retrieveFields()
        const isSavedFormularyFieldsEqualFormularyFields = JSON.stringify(formularyFieldsRef.current) === JSON.stringify(formularyFields)
        if (!isSavedFormularyFieldsEqualFormularyFields) {
            fieldsByFieldUUIDRef.current = {}
            for (const field of formularyFields) {
                fieldsByFieldUUIDRef.current[field.uuid] = field
            }
        }
        return fieldsByFieldUUIDRef.current
    }

    /**
     * Function used for retrieving the variable value, we will retrieve the fieldUUID, and with this uuid, we will get
     * the value to use on the variable. We will retrieve the value as string because we need this to convert to a value 
     * that flow understands.
     * 
     * @param {string} fieldUUID - The uuid of the field to get the value for.
     * 
     * @param {string} - The value to substitute on the formula. For example: 
     * `{{Nome do Cliente}}` will be transformed to `"Nicolas"`, a string inside of "" is something that flow is able to 
     * understand.
     */
    function getVariableValue(fieldUUID) {
        return '20'
    }

    /**
     * This function will set the variables inside of the formula. It will use the occurrences to get the actual variable value of the field.
     * 
     * So for you to understand how this works:
     * - WHen it loads, the variables array hold the single source of truth about the variables
     * - After it loads, while the user is editing, the single source of truth is the occurrences in the formula.
     * 
     * @param {string} formula - The formula that we want to set the variables for.
     * 
     * @returns {string} - Returns the formula with the variables set.
     */
    function setVariablesInFormula(formula) {
        const variableOccurrences = formula.match(VARIABLE_IN_FORMULA_REGEX)
        const doesVariableOccurrencesExist = variableOccurrences !== null && variableOccurrences.length > 0
        const fieldsByFieldUUID = getFieldsByFieldUUID()
        
        if (doesVariableOccurrencesExist) {
            const newVariables = []
            for (let i=0; i<variableOccurrences.length; i++) {
                const variableOccurrence = variableOccurrences[i]
                const variable = field.formulaField.variables[i]
                const variableFieldLabelName = variableOccurrence.replace(/^{{/, '').replace(/}}$/, '')
                
                const doesVariableExistAtIndex = variable !== undefined && typeof variable === 'object'
                
                let variableFieldData = doesVariableExistAtIndex ? fieldsByFieldUUID[variable.variableUUID] : undefined
                const isFieldLabelNameEqualVariable = variableFieldData !== undefined && variableFieldLabelName === variableFieldData.label.name
                    
                if (isFieldLabelNameEqualVariable) {
                    newVariables.push({
                        ...variable,
                        order: i
                    })
                } else {
                    variableFieldData = Object.values(fieldsByFieldUUID).find(field => field.label.name === variableFieldLabelName)
                    const doesFieldExistForGivenVariableLabelName = variableFieldData !== undefined && typeof variableFieldData === 'object'
                    if (doesFieldExistForGivenVariableLabelName) {
                        newVariables.push({
                            uuid: generateUUID(),
                            variableUUID: variableFieldData.uuid,
                            order: i
                        })
                    }
                }
                
                if (variableFieldData !== undefined) {
                    formula = formula.replace(variableOccurrence, getVariableValue(variableFieldData.uuid))
                }
            }
            field.formulaField.variables = newVariables
            onChangeField(field)
        }
        return formula
    }

    /**
     * Function used to retrieve the actual formula that will show in the text editor. We need this to change
     * the `{{}}` with the actual variables of the formula.
     * 
     * @returns {string} - Returns the formula that will be rendered inside of the text editor.
     */
    function getUserFacingFormula(formula=undefined) {
        const isFormulaDefinedInFieldData = typeof field.formulaField === 'object' && 
            field.formulaField.formula !== undefined
        formula = formula !== undefined ? 
            formula : isFormulaDefinedInFieldData ? 
                field.formulaField.formula : undefined
        if (formula !== undefined) {
            let userFacingFormula = formula
            const variableOccurrences = userFacingFormula.match(VARIABLE_IN_FORMULA_REGEX)
            const doesVariableOccurrenceExistInFormula = variableOccurrences !== null && variableOccurrences.length > 0
            if (doesVariableOccurrenceExistInFormula) {
                const fieldsByFieldUUID = getFieldsByFieldUUID()

                for (const { variableUUID } of field.formulaField.variables) {
                    if (fieldsByFieldUUID[variableUUID] !== undefined) {
                        userFacingFormula = userFacingFormula.replace(/{{((\s+)?([^\s{}]+(\s+)?)+)?}}/, `{{${fieldsByFieldUUID[variableUUID].label.name}}}`)
                    }
                }
            }
            return userFacingFormula
        }
        return ''
    }

    /**
     * In the backend we don't have any reference for what this variable refers to, we will only rely on the ordering of the variables
     * inside of `field.formulaField.variables` array. We define this array using the `setVariablesInFormula` function. This function run
     * on two times: when we submit the formula to the backend and when we evaluate the formula.
     * 
     * @returns {string} 
     */
    function getBackendFormula(formula=undefined) {
        const isFormulaDefinedInFieldData = typeof field.formulaField === 'object' && 
            field.formulaField.formula !== undefined
        formula = formula !== undefined ? 
            formula : isFormulaDefinedInFieldData ? 
                field.formulaField.formula : undefined
        if (formula !== undefined) {
            let backendFormula = formula
            const variableOccurrences = formula.match(VARIABLE_IN_FORMULA_REGEX)

            const doesVariableOccurrencesExist = Array.isArray(variableOccurrences) && variableOccurrences.length > 0
            if (doesVariableOccurrencesExist) {
                for (const variableOccurrence of variableOccurrences) {
                    backendFormula = backendFormula.replace(variableOccurrence, '{{}}')
                }
            }
            return backendFormula
        }

        return ''
    }

    /**
     * Function used to create a new formula field data object.
     * 
     * This object is supposed to be used to hold all of the data needed for this specific field type.
     * In this case this object will just hold the formula.
     * 
     * @param {object} formulaFieldOptions - The options that are used to create the formula field data object.
     * @param {string} [formulaFieldOptions.formula=''] - The formula that the user has written.
     * @param {Array<{uuid: string, variableUUID: string, order: number}>} [formulaFieldOptions.variables=[]] - The variables 
     * that are used in the formula. Those variables are fields whose values we want to use in the formula.
     * 
     * @returns {{
     *     uuid: string,
     *     formula: string,
     *     variables: Array<{uuid: string, variableUUID: string, order: number}>
     * }} - The uuid of the custom option and the formula that is used to calculate the value of the field.
     */
    function createFormulaFieldData({
        formula='',
        variables=[]
    }={}) {
        return {
            uuid: generateUUID(),
            formula,
            variables
        }
    }

    /**
     * Callback called whenever the user changes something in the flow codemirror editor. If he adds a space,
     * or deletes something this function will always be called.
     * 
     * It's important to see that we save and handle 2 formulas: 
     * - The user facing formula, this is the formula that the user sees.
     * - The backend formula, this is what we actually use.
     * 
     * The user facing formula is what we show on the editor, where we replace the {{}} with the name of the variables.
     * The backend formula is NOT shown on the editor, but instead it's what we save in the database. All of the names
     * inside of the formula are striped out and left empty with only '{{}}', this make it A LOT easier for us
     * to replace each '{{}}' with the actual values of the formula, since we will follow the order of the array.
     * 
     * @param {string} newFormula - The new formula that the user has entered in the text editor.
     * 
     * @returns {Promise<import('../../../../../shared/flow/builtins/objects').FlowObject>} - Returns a promise that
     * evaluates to a FlowObject.
     */
    function onChangeFormula(newFormula) {
        const formulaData = {
            userFacingFormula: getUserFacingFormula(newFormula),
            forBackendFormula: getBackendFormula(newFormula)
        }
        field.formulaField.formula = formulaData.forBackendFormula
        setFormula(formulaData)
        onChangeField(field)

        return new Promise((resolve, reject) => {
            defaultDelay(() => {
                const actualFormulaWithoutVariables = setVariablesInFormula(newFormula)
                if (isEditingFormula === true && evaluateRef.current) {
                    evaluateRef.current(actualFormulaWithoutVariables)
                        .then(result => resolve(result))
                        .catch(error => reject(error))
                }
            })
        })
    }

    /**
     * This function is used to generate custom options for the autocomplete menu. In order to fully work we need to filter the options here.
     * while the user is typing, the filter functionality does NOT work out of the box when we send the options.
     * 
     * P.S.: We check if something is a variable or not here, variables are defined when written inside between double braces `{{}}`. When they
     * are defined inside of a variable we need to make sure we show the variable options that he can select.
     * 
     * Variables are subst
     * 
     * @param {{name: string, attributeName: string, elementAt: number}} autocompleteData - The autocomplete data that we will use 
     * to filter the options.
     * @param {function} createAutocompleteOptions - A function that is used to create the autocomplete options. This way we can have 
     * a default value. This function is created on `useFlow` hook and passed here as a callback so we can have a default structure.
     * 
     * @returns {Array<{
     *      label: string,
     *      autocompleteText: string,
     *      description: string,
     *      type: string,
     *      rawName: string,
     *      examples: Array<string>,
     *      parameters: Array<{
     *          name: string, 
     *          description: string,
     *          type: string, 
     *          required: boolean
     *      }>,
     *      toSubstitute: {
     *          from: number,
     *          to: number
     *      } | undefined,
     *      cursorOffset: number,
     *      isSnippet: boolean
     * }>} - The array of options created by the `createAutocompleteOptions` function.
     */
    function onAutocomplete(autocompleteData, createAutocompleteOptions) {
        let formularyFields = retrieveFields()
    
        const variableMatch = autocompleteData.name.match(VARIABLE_IN_FORMULA_REGEX)
        const isVariable = variableMatch !== null && variableMatch.length > 0
        const variableFieldName = isVariable === true ? 
            autocompleteData.name.replace(/^{{/, '').replace(/}}$/, '') : autocompleteData.name
        const variableFieldNameIsNotAnEmptyString = variableFieldName !== ''
        if (variableFieldNameIsNotAnEmptyString) {
            formularyFields = formularyFields.filter(field => field.label.name.startsWith(variableFieldName))
        }

        // When setting a variable we need to substitute the value that was inserted with the complete variable.
        // That's exactly what we do here.
        // For example: 'Nome' will be replaced with '{{Nome}}', for this replacing we need the starting position of the element
        // we want to substitute. The ending position otherwise is calculated, we don't need that.
        const toSubstitute = autocompleteData.name.length > 0 ? {
            from: autocompleteData.elementAt,
            to: autocompleteData.elementAt + autocompleteData.name.length
        } : undefined
        const customAutocompleteData = formularyFields.map(field => createAutocompleteOptions(
            `{{${field.label.name}}}`, 
            field.label.name, 
            strings('formularyFieldFormulaVariableDescription'), 
            'custom',
            {
                toSubstitute: toSubstitute
            }
        ))
        return customAutocompleteData
    }

    /**
     * Function supposed to toggle if the user is editing the formula or not. We use this instead of using the 
     * `setIsEditingFormula` state directly. For obvious reasons, only admins are able to edit the formula.
     * 
     * @param {boolean} [isEditing=!isEditingFormula] - if the user is editing the formula it should be true, 
     * otherwise it should be false.
     */
    function onToggleIsEditingFormula(isEditing=!isEditingFormula) {
        if (isUserAnAdmin) {
            setIsEditingFormula(isEditing)
        } 
    }

    /**
     * When the formula field type was just created or if for some other reason the field does not have
     * formula specific data, we will create the data by default when the field is created.
     * 
     * This formula field data is a specific data that is specific for the `formula` field type.
     */
    function onDefaultCreateFormulaOptionsIfDoesNotExist() {
        const doesFormulaFieldDataExist = typeof field.formulaField === 'object' && 
            ![null, undefined].includes(field.formulaField)
 
        if (doesFormulaFieldDataExist === false) {
            field.formulaField = createFormulaFieldData()
            onToggleIsEditingFormula(true)
            onChangeField(field)
        }
    }

    /**
     * This will append the logic for duplicating the formula field.
     * 
     * @param {object} newField - The new field data that was created and duplicated.s
     */
    function onDuplicateFormulaField(newField) {
        newField.formulaField.uuid = generateUUID()
    }

    useEffect(() => {
        onDefaultCreateFormulaOptionsIfDoesNotExist()
        registerOnDuplicateOfField(field.uuid, onDuplicateFormulaField)
    }, [])

    /**
     * This will load and change the FormulaFormatOption menu that is loaded in the field menu.
     * This component is a component that will live inside of the Dropdown Menu of the field, where we configure 
     * the field, stuff like the placeholder, if it's obligatory and so on.
     */
    useEffect(() => {
        registerComponentForFieldSpecificOptionsForDropdownMenu(FormulaFormatOption, {
            onEditFormula: onToggleIsEditingFormula,
            isEditingFormula
        })
    }, [isEditingFormula])

    /** 
     * If the user hasn't configured the formula of a formula field type, by default we will open the screen for him
     * to configure the formula.
     */
    useEffect(() => {
        const isFormulaFieldDataDefined = typeof field.formulaField === 'object' && 
            field.formulaField !== null
        if (isFormulaFieldDataDefined) {
            const isFormulaNOTDefined = ['', null].includes(field.formulaField.formula)
            if (isFormulaNOTDefined) {
                onToggleIsEditingFormula(true)
            } 

            if (field.formulaField.formula !== formula.forBackendFormula) {
                onChangeFormula(field.formulaField.formula)
            }
        }
    }, [field.formulaField])
    
    /**
     * When the external field changes we should also change the internal field value.
     */
    useEffect(() => {
        const isFieldDifferentFromStateField = typeof fieldData !== typeof field && JSON.stringify(fieldData) !== JSON.stringify(field)
        if (isFieldDifferentFromStateField) {
            setField(fieldData)
        }
    }, [fieldData])

    return {
        evaluateRef,
        flowServiceRef,
        onChangeFormula,
        onAutocomplete,
        isEditingFormula,
        onToggleIsEditingFormula,
        userFacingFormula: formula.userFacingFormula
    }
}