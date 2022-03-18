import { useRef, useEffect } from 'react'
import { snakeCaseToCamelCase } from '../../../../shared/utils'
import { 
    faFont, faCalendarAlt, faChevronCircleDown, faPlug, faPaperclip,
    faAlignLeft, faAt, faFingerprint, faAddressBook, faCode, faListUl,
    faCheck, faListAlt
} from '@fortawesome/free-solid-svg-icons'
import { strings } from '../../core'


export default function useFieldTypes(types) {
    const typesRef = useRef([])
    const typeByIdRef = useRef({})

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

    function getFieldTypeLabelNameByFieldTypeId(fieldTypeId) {
        const fieldType = typeByIdRef.current[fieldTypeId]
        const doesFieldTypeExistsForId = typeof fieldType === 'object'
        if (doesFieldTypeExistsForId) {
            const fieldTypeName = snakeCaseToCamelCase(fieldType.name)
            return strings(`fieldType${fieldTypeName.charAt(0).toUpperCase() + fieldTypeName.slice(1)}Label`)
        }
        return ''
    }

    function getIconByFieldTypeId(fieldTypeId) {
        const fieldType = typeByIdRef.current[fieldTypeId]
        const doesFieldTypeExistsForId = typeof fieldType === 'object'
        if (doesFieldTypeExistsForId) {
            const fieldTypeName = fieldType.name
            switch (fieldTypeName) {
                case 'number':
                    return 
                case 'text':
                    return faFont
                case 'date':
                    return faCalendarAlt
                case 'option':
                    return faChevronCircleDown
                case 'connection':
                    return faPlug
                case 'attachment':
                    return faPaperclip
                case 'long_text':
                    return faAlignLeft
                case 'email': 
                    return faAt
                case 'id':
                    return faFingerprint
                case 'user':
                    return faAddressBook
                case 'formula':
                    return faCode
                case 'tags':
                    return faListUl
                case 'checkbox':
                    return faCheck
                case 'multi_field':
                    return faListAlt
                default:
                    return faFont
            }
        }
        return faFont
    }

    useEffect(() => {
        const isTypesRefDifferentFromTypes = JSON.stringify(typesRef.current) !== JSON.stringify(types)
        if (isTypesRefDifferentFromTypes) {
            getTypesById()
            typesRef.current = types
        }
    }, [types])

    return {
        getIconByFieldTypeId,
        getFieldTypeLabelNameByFieldTypeId,
        getTypesById,
        typeByIdRef
    }
}