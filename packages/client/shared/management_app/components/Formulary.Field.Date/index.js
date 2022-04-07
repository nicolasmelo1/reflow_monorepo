import { useState, useEffect } from 'react'
import { useDateField } from '../../hooks'
import Layout from './layouts'

/**
 * This format is used to hold all of the custom options toggle of the date field. For the `date` field type.
 * When he toggles between autoCreate or autoUpdate the input will be hidden for him and we will display a message similar to the 
 * formula field type or to the id field type. Besides that the user can also select the date format types.
 * 
 * @param {object} props - The props that the dropdown menu for this field type recieves
 * @param {boolean} [props.autoCreate=false] - Is the value of this field set up when we create a new record?
 * @param {boolean} [props.autoUpdate=false] - Is the value of this field set up when we update (or create) 
 * an existing record?
 * @param {(isToAutoCreate: void) => void} [props.onAutoCreate=undefined] - This is called when the user 
 * toggles the autoCreate option switch.
 * @param {(isToAutoUpdate: void) => void} [props.onAutoUpdate=undefined] - This is called when the user
 * toggles the autoUpdate option switch.
 * 
 * @returns {import('react').ReactElement} - The react element rendered from this component.
 */
export function DateFormatOption(props) {
    const isToAutoCreate = typeof props.autoCreate === 'boolean' ? props.autoCreate : false
    const isToAutoUpdate = typeof props.autoUpdate === 'boolean' ? props.autoUpdate : false
    const isOnChangeAutoCreateDefined = typeof props.onChangeAutoCreate === 'function'
    const isOnChangeAutoUpdateDefined = typeof props.onChangeAutoUpdate === 'function'
    
    const [isAutomaticWhenRegisterIsCreated, setIsAutomaticWhenRegisterIsCreated] = useState(isToAutoCreate)
    const [isAutomaticWhenRegisterIsUpdated, setIsAutomaticWhenRegisterIsUpdated] = useState(isToAutoUpdate)

    /**
     * This is called when the user toggles to or not to autoCreate the value of the field.
     * 
     * @param {boolean} [isToAutoCreate=!isAutomaticWhenRegisterIsCreated] - Is the value of 
     * this field set up when we create a new record?
     */
    function onToggleAutoCreate(isToAutoCreate=!isAutomaticWhenRegisterIsCreated) {
        setIsAutomaticWhenRegisterIsCreated(isToAutoCreate)
        if (isOnChangeAutoCreateDefined) props.onChangeAutoCreate(isToAutoCreate)
    }

    /**
     * This is called whenever the user toggles to or not to autoUpdate the value of the field.
     * 
     * @param {boolean} [isToAutoUpdate=!isAutomaticWhenRegisterIsUpdated] - Is the value of
     * this field set up when we update (or create) an existing record?
     */
    function onToggleAutoUpdate(isToAutoUpdate=!isAutomaticWhenRegisterIsUpdated) {
        setIsAutomaticWhenRegisterIsUpdated(isToAutoUpdate)
        if (isOnChangeAutoUpdateDefined) props.onChangeAutoUpdate(isToAutoUpdate)
    }

    useEffect(() => {
        const isAutoCreatePropsDefined = typeof props.autoCreate === 'boolean'
        const isAutoCreatePropsDifferentFromState = props.autoCreate !== isAutomaticWhenRegisterIsCreated

        if (isAutoCreatePropsDefined && isAutoCreatePropsDifferentFromState) {
            setIsAutomaticWhenRegisterIsCreated(props.autoCreate)
        }
    }, [props.autoCreate])

    useEffect(() => {
        const isAutoUpdatedPropsDefined = typeof props.autoUpdate === 'boolean'
        const isAutoUpdatePropsDifferentFromState = props.autoUpdate !== isAutomaticWhenRegisterIsUpdated

        if (isAutoUpdatedPropsDefined && isAutoUpdatePropsDifferentFromState) {
            setIsAutomaticWhenRegisterIsUpdated(props.autoUpdate)
        }
    }, [props.autoUpdate])

    return (
        <Layout.DropdownMenu
        isToAutoCreate={isAutomaticWhenRegisterIsCreated}
        isToAutoUpdate={isAutomaticWhenRegisterIsUpdated}
        onToggleAutoCreate={onToggleAutoCreate}
        onToggleAutoUpdate={onToggleAutoUpdate}
        />
    )
}
// ------------------------------------------------------------------------------------------
export default function FormularyFieldDate(props) {    
    const { 
        isDatepickerOpen, onToggleDatepicker
    } = useDateField(
        props.field, props.onChangeField, 
        props.registerComponentForFieldSpecificOptionsForDropdownMenu, 
        props.registerOnDuplicateOfField
    )

    return (
        <Layout.Field
        types={props.types}
        field={props.field}
        onToggleDatepicker={onToggleDatepicker}
        isOpen={isDatepickerOpen}
        />
    ) 
}
