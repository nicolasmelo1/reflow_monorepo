import { useRef, useState, useEffect, useContext } from 'react'
import { delay, generateUUID } from '../../../../../shared/utils'
import { WorkspaceContext } from '../../../authentication/contexts'
import Layout from './layouts'

const defaultDelay = delay(2000)

/**
 * This is the DropdownMenu component that is used to display the custom options for the formula field type.
 * We don't have much special configuration here, the only thing we do is that we open or close the formula 
 * editor when we click a special button. The text of this button changes weather the formula editor is open or not.
 * 
 * @param {object} props - The props that this component recieves
 * @param {(isEditing: boolean) => void} props.onEditFormula - A function that is called when the user clicks the 
 * button to edit the formula
 * @param {boolean} [props.isEditingFormula=false] - A boolean that indicates weather the formula editor is open or not.
 * By default it is set to false.
 * 
 * @returns {import('react').ReactElement} - Returns a react element to be rendered.
 */
function FormulaFormatOption(props) {
    const defaultValueIsEditingFormula = typeof props.isEditingFormula === 'boolean' ? props.isEditingFormula : false
    const [isEditingFormula, setIsEditingFormula] = useState(defaultValueIsEditingFormula)

    /**
     * Function used to toggle if the formula editor is open or not.
     * 
     * By default it is the opposite value that it was set before.
     */
    function onEditFormula() {
        const newValue = !isEditingFormula
        setIsEditingFormula(newValue)
        props.onEditFormula(newValue)
    }

    return (
        <Layout.DropdownMenu
        isEditingFormula={isEditingFormula}
        onEditFormula={onEditFormula}
        />
    )
}
// ------------------------------------------------------------------------------------------
export default function FormularyFieldFormula(props) {
    const evaluateRef = useRef(null)

    const { state: { selectedWorkspace: { isAdmin: isUserAnAdmin } } } = useContext(WorkspaceContext)
    const [isEditingFormula, setIsEditingFormula] = useState(false)
    
    /**
     * Function used to create a new formula field data object.
     * 
     * This object is supposed to be used to hold all of the data needed for this specific field type.
     * In this case this object will just hold the formula.
     * 
     * @returns {{
     *     uuid: string,
     *     formula: string
     * }} - The uuid of the custom option and the formula that is used to calculate the value of the field.
     */
    function createFormulaFieldData({
        formula=''
    }={}) {
        return {
            uuid: generateUUID(),
            formula
        }
    }


    /**
     * Callback called whenever the user changes something in the flow codemirror editor. If he adds a space,
     * or deletes something this function will always be called.
     * 
     * By default the flow codemirror component expect us to return the type of the value that the formula gives us
     * and the represented value.
     * 
     * @param {string} newFormula - The new formula that the user has entered in the text editor.
     * 
     * @returns {Promise<import('../../../../../shared/flow/builtins/objects').FlowObject>} - Returns a promise that
     * evaluates to a FlowObject.
     */
    function onChangeFormula(newFormula) {
        props.field.formulaField.formula = newFormula
        props.onUpdateFormulary()

        return new Promise((resolve, reject) => {
            defaultDelay(() => {
                evaluateRef.current(newFormula)
                    .then(result => resolve(result))
                    .catch(error => reject(error))
            })
        })
    }

    function onToggleIsEditingFormula(isEditing=!isEditingFormula) {
        if (isUserAnAdmin) {
            setIsEditingFormula(isEditing)
        } 
    }


    function onDefaultCreateFormulaOptionsIfDoesNotExist() {
        if (props.field.formulaField === null) {
            props.field.formulaField = createFormulaFieldData()
            props.onUpdateFormulary()
        }
    }

    useEffect(() => {
        onDefaultCreateFormulaOptionsIfDoesNotExist()
        props.addComponentForFieldSpecificOptionsForDropdownMenu(FormulaFormatOption, {
            onEditFormula: onToggleIsEditingFormula,
            isEditingFormula
        })
    }, [isEditingFormula])


    useEffect(() => {
        const isFormulaFieldDataDefined = typeof props.field.formulaField === 'object' && 
            props.field.formulaField !== null
        if (isFormulaFieldDataDefined && props.field.formulaField.formula === '') {
            onToggleIsEditingFormula(true)
        }
    }, [props.field.formulaField])

    return (
        <Layout.Field
        evaluateRef={evaluateRef}
        onChangeFormula={onChangeFormula}
        isEditingFormula={isEditingFormula}
        onToggleIsEditingFormula={onToggleIsEditingFormula}
        types={props.types}
        field={props.field}
        />
    )
}
