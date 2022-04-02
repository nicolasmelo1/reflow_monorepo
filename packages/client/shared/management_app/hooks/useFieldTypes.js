import { useContext, useRef, useEffect } from 'react'
import { snakeCaseToCamelCase } from '../../../../shared/utils'
import { strings } from '../../core'
import { AppManagementTypesContext } from '../contexts'


/**
 * Useful hook created for handling field types. Since the types can change dependending on the context you can send the
 * types array so we will use it inside of the hook, otherwise, by default it will retrieve the fieldTypes from the context.
 * 
 * @param {Array<{id: number, name: string}> | undefined} [types=undefined] - The field types to be considered and use depending on the 
 * context.
 * 
 * @returns {{
 *      getFieldTypeLabelNameByFieldTypeId: (fieldTypeId: number) => string,
 *      getTypesById: () => object,
 *      typeByIdRef: { current: object }
 * }} - Returns a function to retrieve the field type label name by the id. A function to retrieve the type by the field id.
 * And an object to retrieve the type by the fieldTypeId.
 */
export default function useFieldTypes(types=undefined) {
    const { state: { types: { fieldTypes } } } = useContext(AppManagementTypesContext)
    const isTypesDefined = Array.isArray(types)
    types = isTypesDefined ? types : fieldTypes

    const typesRef = useRef([])
    const typeByIdRef = useRef({})
    
    /**
     * This will retrieve an object where the the fieldTypeId is each key, and the value of each of the keys
     * is the object itself.
     * 
     * This will make it easier to handle and retrieve the name of the field type by it's id.
     * This is cached, so we will only regenerate a new one when the fieldType changes.
     * 
     * @returns {object} - An object where each fieldTypeId is the key and the value is the fieldType.
     */
    function getTypesById() {
        const hasTypesChanged = JSON.stringify(typesRef.current) !== JSON.stringify(types) && Array.isArray(types)
        if (hasTypesChanged) {
            typeByIdRef.current = {}
            for (const type of types) {
                typeByIdRef.current[type.id] = type
            }
        }
        return typeByIdRef.current
    }

    /**
     * Retrieve the label name of the field by it's id. Remembering that label name is the value that will be shown
     * to the user of this field type.
     * 
     * @param {number} fieldTypeId - The id of the fieldtype to use.
     * 
     * @returns {string} - The label name o0f the field type.
     */
    function getFieldTypeLabelNameByFieldTypeId(fieldTypeId) {
        const fieldType = typeByIdRef.current[fieldTypeId]
        const doesFieldTypeExistsForId = typeof fieldType === 'object'
        if (doesFieldTypeExistsForId) {
            const fieldTypeName = snakeCaseToCamelCase(fieldType.name)
            return strings(`fieldType${fieldTypeName.charAt(0).toUpperCase() + fieldTypeName.slice(1)}Label`)
        }
        return ''
    }

    
    useEffect(() => {
        const isTypesRefDifferentFromTypes = JSON.stringify(typesRef.current) !== JSON.stringify(types)
        if (isTypesRefDifferentFromTypes) {
            getTypesById()
            typesRef.current = types
        }
    }, [types])

    return {
        getFieldTypeLabelNameByFieldTypeId,
        getTypesById,
        typeByIdRef
    }
}