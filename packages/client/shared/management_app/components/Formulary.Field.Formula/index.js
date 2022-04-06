import { useState } from 'react'
import Layout from './layouts'
import useFormulaField from '../../hooks/useFormulaField'

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
export function FormulaFormatOption(props) {
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
    const {
        evaluateRef,
        flowServiceRef,
        onChangeFormula,
        onAutocomplete,
        isEditingFormula,
        onToggleIsEditingFormula,
        userFacingFormula
    } = useFormulaField(
        props.field, props.onChangeField, props.registerComponentForFieldSpecificOptionsForDropdownMenu,
        props.registerOnDuplicateOfField, props.retrieveFields
    )

    return (
        <Layout.Field
        evaluateRef={evaluateRef}
        flowServiceRef={flowServiceRef}
        onChangeFormula={onChangeFormula}
        onAutocomplete={onAutocomplete}
        isEditingFormula={isEditingFormula}
        onToggleIsEditingFormula={onToggleIsEditingFormula}
        formula={userFacingFormula}
        field={props.field}
        />
    )
}
