import { useRef, useState } from 'react'
import { deepCopy, generateUUID } from '../../../../shared/utils'

/**
 * This special hook is used for managing the field. On here we have all of the logic needed to handle the duplication,
 * removal and load custom options for the field.
 * 
 * @param {(fieldData: object, namespaces: Array<string>) => void} onDuplicateFieldCallback - This is the function that is 
 * called when the user clicks to duplicate the field. Let me explain, on the formulary or the listing we have all of the 
 * control of all of the fields of the formulary, this means that this is supposed to handle the duplication of the field.
 * The `onDuplicateField` function inside here is the one that is called when the user clicks to duplicate, and then this function
 * does some work and call the `onDuplicateFieldCallback` function that is passed in here.
 * @param {(fieldData: object, namespaces: Array<string>) => void} onRemoveFieldCallback - This is the function that is called
 * when the user clicks to remove the field. Let me explain, on the formulary or the listing we have all of the control of all
 * of the fields of the formulary, this means that this is supposed to handle the removal of the field. The `onRemoveField` function
 * inside here is the one that is called when the user clicks to remove, and then this function does some work and call the
 * `onRemoveFieldCallback` function that is passed in here.
 */
export default function useFieldEdit(onDuplicateFieldCallback, onRemoveFieldCallback) {
    const onDuplicateCallbackRef = useRef(null)
    const onDeleteCallbackRef = useRef(null)
    const componentOptionForDropdownMenuRef = useRef(null)
    const [customOptionForDropdownMenuProps, setCustomOptionForDropdownMenuProps] = useState({}) 

    /**
     * Registers a callback function to be called when we want to duplicate the field, this callback will recieve
     * the new field data duplicated and it should update the state in place.
     * 
     * @param {(fieldData: object) => void} callback - The callback function to be called when we 
     * want to duplicate the field.
     */
    function registerOnDuplicateOfField(callback) {
        onDuplicateCallbackRef.current = callback
    }

    /**
     * Registers a callback function to be called when we want to remove the field, this callback will recieve
     * the field data removed and then you can have whatever logic you need.
     * 
     * @param {(fieldData: object) => void} callback - The callback function to be called when we
     * want to remove the field.
     */
    function registerOnDeleteOfField(callback) {
        onDeleteCallbackRef.current = callback
    }

    function onRemoveField(fieldData) {
        const isCallbackDefined = typeof onDeleteCallbackRef.current === 'function'
        if (isCallbackDefined) {
            onDeleteCallbackRef.current(fieldData)
        }
        console.log('onRemoveFieldCallback')
        onRemoveFieldCallback(fieldData)
    }

    /**
     * This is the function that is called when the user clicks to duplicate the field in the `FieldEditMenuDropdown` component.
     * In other words, in the dropdown menu to edit the field, the user can click to duplicate the field, when he does this
     * we need to generate new uuid's/ids to the values that exists, instead of handling this inside of a single function fot all
     * of the field types, each field type handles their own logic for duplicating the field.
     * 
     * @param {{
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
     * }} fieldData - The data of the field that is being duplicated.
     */
    function onDuplicateField(fieldData) {
        const newField = deepCopy(fieldData)
        const originalUUID = newField.uuid
        newField.uuid = generateUUID()

        const isCallbackDefined = typeof onDuplicateCallbackRef.current === 'function'
        if (isCallbackDefined) {
            onDuplicateCallbackRef.current(newField)
        }
        onDuplicateFieldCallback(originalUUID, newField)
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
        registerOnDuplicateOfField,
        registerOnDeleteOfField,
        registerComponentForFieldSpecificOptionsForDropdownMenu,
        onDuplicateCallbackRef,
        onDeleteCallbackRef,
        onRemoveField,
        onDuplicateField,
        componentOptionForDropdownMenuRef,
        customOptionForDropdownMenuProps
    }
}