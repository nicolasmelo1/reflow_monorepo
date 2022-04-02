import { useRef, useState } from 'react'
import { deepCopy, generateUUID } from '../../../../shared/utils'

/**
 * This special hook is used for managing the field. On here we have all of the logic needed to handle the duplication,
 * removal and load custom options for the field.
 */
export default function useFieldEdit(fieldData, onChangeField) {
    const componentOptionForDropdownMenuRef = useRef(null)
    const [customOptionForDropdownMenuProps, setCustomOptionForDropdownMenuProps] = useState({}) 
    const [isFieldEditDropdownMenuOpen, setIsFieldEditDropdownMenuOpen] = useState(isNewField)

    /**
     * Updates the label name of the field. When we update it we also update the hole formulary and rerender it again.
     * 
     * @param {string} newLabelName - The new label name of the field.
     */
     function onChangeFieldLabelName(newLabelName) {
        field.label.name = newLabelName
        onChangeFieldConfiguration(props.field, ['label', 'name'])
    }

    /**
     * This is used to toggle the edit dropdown menu of the field. This means that the
     * settings of the field will be shown or closed.
     * 
     * @param {boolean} isOpen - Is the field edit dropdown menu open or closed?
     */
     function onToggleEditFieldMenu(isOpen=!isEditMenuOpen) {
        setIsFieldEditDropdownMenuOpen(isOpen)
    }

    /**
     * This will add components to the dropdown menu so the user can edit it.
     * 
     * This data that the field needs comes from the component of the field type. 
     * 
     * What this means in other words is, suppose that for `number` fieldType we need to add the checkbox
     * if we allow negative numbers to this input and the checkbox to be checked if we allow numbers to be 0.
     * This means we need two extra switches in the dropdown menu to edit the field.
     * 
     * For that we would need to know here what the options are for the `number` fieldType.
     * 
     * We would need to define it for each fieldType here directly. But we can be more efficient and divide this responsability.
     * In the `Formulary.Field.Number` component we can define the options that can exist in the dropdown. And then append it using 
     * this function.
     * 
     * For example:
     * 
     * ```
     * function DefaultValueInput(props) {
     *      const [defaultValue, setDefaultValue] = useState(props.value)
     * 
     *      function onChange(value) {
     *          props.onChange(value)
     *          setDefaultValue(value)
     *      }
     * 
     *      return <input type={'text'} value={defaultValue} onChange={(e) => onChange(e.target.value)}/>
     * }
     * 
     * function FormularyFieldText(props) {
     *      function onChangeDefaultValueInCustomOption(value) {
     *          props.field.defaultValue = value
     *          props.onUpdateFormulary()
     *      }
     *      
     *      useEffect(() => {
     *          props.registerComponentForFieldSpecificOptionsForDropdownMenu(
     *              DefaultValueInput,
     *              {
     *                  value: defaultValue,
     *                  onChange: onChangeDefaultValueInCustomOption
     *              }
     *         )
     *      }, [props.field.defaultValue])
     * 
     *      return APP === 'web' ? (
     *          <Layouts.Web types={props.types} field={props.field} />
     *      ) : (
     *          <Layouts.Mobile/>
     *      )
     * }
     * ```
     * 
     * So in this example let's look for some things: 
     * FormularyFieldText has a useEffect function with `props.field.defaultValue` as dependency, this means that it will be called everytime the `props.field.defaultValue` 
     * changes to a new value. So we will be able rerender the `DefaultValueInput` component even though the logic is kept completely in the `FormularyFieldNumber` component.
     *
     * Important thing to note is that we DO NOT keep track of when the `onChangeDefaultValueInCustomOption` function changes in the `useEffect` hook, that's because it's a function
     * and the only purpose of functions is to serve as a callback we do not need to rerender the component everytime the function changes.
     * 
     * @param {import('react').ReactElement} component - The component that holds all of the custom options for the field type.
     * @param {object} props - The props that the component will receive.
     */
    function registerComponentForFieldSpecificOptionsForDropdownMenu(component, componentProps={}) {
        componentOptionForDropdownMenuRef.current = component
        setCustomOptionForDropdownMenuProps(componentProps)
    }

    return {
        isFieldEditDropdownMenuOpen,
        registerComponentForFieldSpecificOptionsForDropdownMenu,
        componentOptionForDropdownMenuRef,
        customOptionForDropdownMenuProps,
        onChangeFieldLabelName,
        onToggleEditFieldMenu
    }
}