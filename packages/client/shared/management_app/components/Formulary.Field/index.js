import { useRef, useContext, useState, useEffect } from 'react'
import { AppManagementTypesContext } from '../../contexts'
import { WorkspaceContext } from '../../../authentication/contexts'
import { APP } from '../../../conf'
import { useFieldTypes, useFieldEdit } from '../../hooks'
import Layout from './layouts'


export default function FormularyField(props) {
    const isNewField = typeof props.isNewField === 'boolean' ? props.isNewField : false

    const fieldRef = useRef()
    const isHoveringRef = useRef(isNewField)
    const fieldEditMenuButtonRef = useRef()

    const { state: { selectedWorkspace }} = useContext(WorkspaceContext)
    const { state: { types } } = useContext(AppManagementTypesContext)
    const [isHovering, _setIsHovering] = useState(isHoveringRef.current)
    const [isRenaming, setIsRenaming] = useState(isNewField)
    const { getTypesById } = useFieldTypes(types.fieldTypes)
    const {
        registerComponentForFieldSpecificOptionsForDropdownMenu,
        componentOptionForDropdownMenuRef,
        customOptionForDropdownMenuProps,
        onToggleEditFieldMenu,
        isFieldEditDropdownMenuOpen,
        onChangeFieldLabelName,
     } = useFieldEdit(props.field, props.onChangeField)


    function setIsHovering(isUserHoveringOnField=!isHovering) {
        isHoveringRef.current = isUserHoveringOnField
        _setIsHovering(isUserHoveringOnField)
    }

    /**
     * / * WEB ONLY * /
     * 
     * This is a web only function that is used to show a menu button when the user hovers over the field.
     * This way admins can edit the field.
     * 
     * @param {boolean} isUserHoveringField - Whether or not the user is hovering over the field.
     */
    function webOnHoverFieldWeb(isUserHoveringField) {
        if (isUserHoveringField === false) {
            setIsHovering(isUserHoveringField)
            //onToggleEditFieldMenu(false)
        } else {
            setIsHovering(isUserHoveringField)
        }
    }
    
    /**
     * / * WEB ONLY * /
     * 
     * This is a web only function that is used to show or dismiss the menu button on the field. This way the admin
     * can easily edit and change the field settings in a dropdown menu. Also by activating this on hover we are able 
     * to progressively make the user understand the platform.
     * 
     * @param {MouseEvent} e - The mouse event that is triggered when the user hovers over the document.
     */
    function webDismissEditFieldButton(e) {
        if (fieldRef.current && fieldRef.current.contains(e.target) && isHoveringRef.current === false) {
            webOnHoverFieldWeb(true)
        } else if (fieldRef.current && !fieldRef.current.contains(e.target) && isHoveringRef.current === true) {
            webOnHoverFieldWeb(false)
        }
    }

    useEffect(() => {
        if (APP === 'web') {
            document.addEventListener('mousemove', webDismissEditFieldButton)
        }
        return () => {
            if (APP === 'web') {
                document.removeEventListener('mousemove', webDismissEditFieldButton)
            }
        }
    }, [])
   
    return (
        <Layout.Field
        registerRetrieveFieldsCallback={props.registerRetrieveFieldsCallback}
        fieldRef={fieldRef}
        fieldEditMenuButtonRef={fieldEditMenuButtonRef}
        isFieldEditDropdownMenuOpen={isFieldEditDropdownMenuOpen}
        onToggleEditFieldMenu={onToggleEditFieldMenu}
        workspace={selectedWorkspace}
        types={types}
        field={props.field}
        retrieveFields={props.retrieveFields}
        isHovering={isHovering}
        getTypesById={getTypesById}
        setIsRenaming={setIsRenaming}
        isRenaming={isRenaming}
        isNewField={isNewField}
        registerOnDuplicateOfField={props.registerOnDuplicateOfField}
        registerOnDeleteOfField={props.registerOnDeleteOfField}
        registerRetrieveFieldsOfField={props.registerRetrieveFieldsOfField}
        registerComponentForFieldSpecificOptionsForDropdownMenu={registerComponentForFieldSpecificOptionsForDropdownMenu}
        componentOptionForDropdownMenuRef={componentOptionForDropdownMenuRef}
        customOptionForDropdownMenuProps={customOptionForDropdownMenuProps}
        onChangeFieldLabelName={onChangeFieldLabelName}
        onChangeField={props.onChangeField}
        onUpdateFormulary={props.onUpdateFormulary}
        onRemoveField={props.onRemoveField}
        onDuplicateField={props.onDuplicateField}
        />
    )
}
