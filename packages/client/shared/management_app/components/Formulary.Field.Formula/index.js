import { useState, useRef } from 'react'
import { useFlow } from '../../../flow'
import { delay } from '../../../../../shared/utils'
import Layout from './layouts'
import { useClickedOrPressedOutside } from '../../../core'

const defaultDelay = delay(1000)

export default function FormularyFieldFormula(props) {
    const editorContainerRef = useRef()
    const isInputFocusedRef = useRef(false)
    const [autocompleteOptions, setAutocompleteOptions] = useState([])
    const { 
        flowServiceRef, editorView, editorRef, performTest, runtimeModulesDocumentationRef, dispatchChange
    } = useFlow({ 
        dispatchCallback: onChange, 
        onAutocompleteFunctionOrModule: onAutocompleteFunctionOrModule,
        onAutoComplete: onAutoComplete,
        onBlur: () => onBlur(),
        onFocus: () => onToggleInputFocus(true)
    })
    useClickedOrPressedOutside({ ref: editorContainerRef, callback: () => onToggleInputFocus(false) })
    
    function onChange(text) {
        /*defaultDelay(() => {
            performTest(text).then(async result => {
                if (result !== undefined && result._representation_ !== undefined) {
                    const realResult = await(await result._string_())._representation_()
                    console.log(realResult)
                }
            })
        })*/
    }

    function onClickAutocomplete(label) {
        dispatchChange(label)
    }

    function onBlur() {
        if (isInputFocusedRef.current === true) editorView.current.contentDOM.focus()
        //setAutocompleteOptions([])
    }

    function onToggleInputFocus(isFocused=!isInputFocused) {
        isInputFocusedRef.current = isFocused

        if (isFocused === false) {
            setAutocompleteOptions([])
            editorView.current.contentDOM.blur()
        }
    }

    function onAutoComplete(autocomplete) {
        if (autocomplete.attributeName === '') {
            const filteredModules = autocomplete.name !== '' ? runtimeModulesDocumentationRef.current.filter(module => module.name.startsWith(autocomplete.name)) : runtimeModulesDocumentationRef.current
            setAutocompleteOptions(
                filteredModules.map(module => ({
                    label: `${module.name}.`,
                    description: module?.description,
                    type: "module"
                }))
            )
        } else if (autocomplete.attributeName !== '') {
            const flowContext = flowServiceRef.current.context
            const builtinModule = runtimeModulesDocumentationRef.current.find(module => module.name === autocomplete.attributeName)

            if (builtinModule) {
                const hasMethods = typeof builtinModule?.methods === 'object'
                const listMethods = hasMethods === true ? Object.values(builtinModule.methods) : []
                const filteredMethods = autocomplete.name !== '' ? listMethods.filter(method => method.name.startsWith(autocomplete.name)) : listMethods
                const options = filteredMethods.map(method => {
                    const hasParameters = typeof method?.parameters === 'object'
                    const listParameters = hasParameters === true ? Object.values(method.parameters) : []
                    return {
                        type: 'function',
                        label: `${method.name}(${hasParameters ? listParameters.map(parameter => parameter.name).join(`${flowContext.positionalArgumentSeparator} `) : ''})`,
                        info: method.description,
                    }
                })
                setAutocompleteOptions(options)
            } else {
                setAutocompleteOptions([])
            }
        } else {
            console.log(autocomplete)
        }
    }

    function onAutocompleteFunctionOrModule(autocompleteData) {
        //console.log(autocompleteData)
    }

    return (
        <Layout
        editorContainerRef={editorContainerRef}
        editorRef={editorRef}
        onClickAutocomplete={onClickAutocomplete}
        autocompleteOptions={autocompleteOptions}
        types={props.types}
        field={props.field}
        />
    )
}
