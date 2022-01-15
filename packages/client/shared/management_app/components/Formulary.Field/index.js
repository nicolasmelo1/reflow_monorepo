import { useRef, useContext, useState } from 'react'
import Layouts from './layouts'
import { AppManagementTypesContext } from '../../contexts'


export default function FormularyField(props) {
    const fieldTypeNameCacheRef = useRef()
    const { state: { types } } = useContext(AppManagementTypesContext)
    const [isHovering, setIsHovering] = useState(false)
    const [isEditMenuOpen, setIsEditMenuOpen] = useState(true)
    const [isRenaming, setIsRenaming] = useState(false)
    
    /**
     * / * WEB ONLY * /
     * 
     * This is a web only function that is used to show a menu button when the user hovers over the field.
     * This way admins can edit the field.
     * 
     * @param {boolean} isUserHoveringField - Whether or not the user is hovering over the field.
     */
    function onHoverFieldWeb(isUserHoveringField) {
        if (isUserHoveringField === false) {
            setIsHovering(isUserHoveringField)
            setIsEditMenuOpen(false)
        } else {
            setIsHovering(isUserHoveringField)
        }
    }

    /**
     * This will open the dropdown for the user to edit the field.
     * It is a toogle so when the user clicks the first time it will open, the second time
     * it will close.
     */
    function onToggleEditFieldMenu() {
        setIsEditMenuOpen(!isEditMenuOpen)
    }

    /**
     * Retrieves the field type name from the cache if it exists or save the type name to the cache so we do
     * not need to loop everytime we want to retrieve this information.
     * 
     * This use the props directly so there is no need to pass anything to this function in order to retrieve
     * the data that you need.
     * 
     * @returns {string} - Returns the field type name of the field.
     */
    function retrieveFieldTypeName() {
        const isCacheDefined = ![null, undefined].includes(fieldTypeNameCacheRef.current)
        const fieldTypeId = props.field.fieldTypeId

        if (isCacheDefined && fieldTypeNameCacheRef.current.fieldTypeId === fieldTypeId) {
            return fieldTypeNameCacheRef.current.fieldTypeName
        } else {
            for (const fieldType of types.fieldType) {
                if (fieldType.id === fieldTypeId) {
                    fieldTypeNameCacheRef.current = {
                        fieldTypeId,
                        fieldTypeName: fieldType.name
                    }
                    return fieldType.name
                }
            }
            return ''
        }
    }

    return process.env['APP'] === 'web' ? (
        <Layouts.Web
        types={types}
        field={props.field}
        retrieveFieldTypeName={retrieveFieldTypeName}
        onHoverFieldWeb={onHoverFieldWeb}
        isHovering={isHovering}
        onToggleEditFieldMenu={onToggleEditFieldMenu}
        isEditMenuOpen={isEditMenuOpen}
        setIsRenaming={setIsRenaming}
        isRenaming={isRenaming}
        />
    ) : (
        <Layouts.Mobile/>
    )
}
