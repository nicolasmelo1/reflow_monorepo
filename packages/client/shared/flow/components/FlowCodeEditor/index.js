import { useRef, useState } from 'react'
import { useFlow } from '../../hooks'
import { useClickedOrPressedOutside, strings } from '../../../core'
import Layouts from './layouts'

/**
 * This is different from the other components, most of the logic is on the layout itself and not here.
 * That's because there are lot of particularities between react native and react that we need to address.
 * 
 * @param {object} props - The props for this component
 * @param {}
 */
export default function FlowCodeEditor(props) {
    const codeEditorFunctionsRef = props.codeEditorFunctionsRef !== undefined ? props.codeEditorFunctionsRef : useRef({})
    
    const editorContainerRef = useRef()
    const isInputFocusedRef = useRef(false)
    const cursorPositionRef = useRef({ from: 0, to: 0})
    const [autocompleteOptions, setAutocompleteOptions] = useState([])
    const [hoveringAutocompleteOption, setHoveringAutocompleteOption] = useState(null)
    const [autocompleteModulesOrFunctions, setAutocompleteModulesOrFunctions] = useState(null)
    const { 
        flowServiceRef,
        runtimeModulesDocumentationRef,
        getFlowContext,
        performTest
    } = useFlow()
    useClickedOrPressedOutside({ ref: editorContainerRef, callback: () => onToggleInputFocus(false) })
    
    function onChangeFormula(text) {
        //console.log(text)
        /*defaultDelay(() => {
            performTest(text).then(async result => {
                if (result !== undefined && result._representation_ !== undefined) {
                    const realResult = await(await result._string_())._representation_()
                    console.log(realResult)
                }
            })
        })*/
    }

    function onCursorMove({ from=0, to=0 }={}) {
        cursorPositionRef.current = { from, to }
    }

    /**
     * Function called when on the onClick event handler, when the user select a module or a function from the formula autocomplete.
     * 
     */
    function onClickAutocomplete({ label='', cursorAt=undefined, snippet=null }={}) {
        if (snippet !== null) {
            codeEditorFunctionsRef.current.dispatchChange('', { withSnippet: snippet })
        } else if (cursorAt !== undefined) {
            codeEditorFunctionsRef.current.dispatchChange(label, { 
                withCursorAt: label.length + cursorPositionRef.current.from + cursorAt,
            })
        } else {
            codeEditorFunctionsRef.current.dispatchChange(label)
        }
    }

    function onBlur() {
        if (isInputFocusedRef.current === true) codeEditorFunctionsRef.current.forceFocus()
    }

    function onFocus() {
        onToggleInputFocus(true)
    }

    function onToggleInputFocus(isFocused=!isInputFocused) {
        isInputFocusedRef.current = isFocused

        if (isFocused === false) {
            setAutocompleteModulesOrFunctions(null)
            setAutocompleteOptions([])
            codeEditorFunctionsRef.current.forceBlur()
        }
    }

    /**
     * This function will be called whenever the user is typing something in the editor. This way, while the user is typing we can display 
     * the autocomplete options for him. This makes really easy to understand and learn how flow works.
     * 
     * @param {{name: string, attributeName: string}} autocomplete - The autocomplete object that holds the informations needed to filter the autocomplete options.
     * By default, `name` is filled with whatever the user types. The `attributeName` is the name of the attribute that the user is in. For example: 
     * ```
     * HTTP.
     * ```
     * The attribute name is "HTTP", so we need to display the functions from the HTTP module.
     */
    function onAutoComplete(autocomplete) {
        let options = []

        const languageOptions = [
            {
                label: `${strings('flowIfKeyword', { environment: 'shared' })}`,
                snippet: (`${strings('flowIfKeyword', { environment: 'shared' })}` +
                                  ` #{condição} ${strings('flowDoKeyword', { environment: 'shared' })}\n` + 
                                  `  #{quando verdadeiro}\n${strings('flowEndKeyword', { environment: 'shared' })}`).substring(autocomplete.name.length),
                type: 'language'
            },
            {
                label: `${strings('flowIfKeyword', { environment: 'shared' })} - ${strings('flowElseKeyword', { environment: 'shared' })}`,
                snippet: (`${strings('flowIfKeyword', { environment: 'shared' })}` +
                                  ` #{condição} ${strings('flowDoKeyword', { environment: 'shared' })}\n` + 
                                  `  #{quando verdadeiro}\n${strings('flowElseKeyword', { environment: 'shared' })}` +
                                  ` ${strings('flowDoKeyword', { environment: 'shared' })}\n  #{quando falso}\n` + 
                                  `${strings('flowEndKeyword', { environment: 'shared' })}`).substring(autocomplete.name.length),
                type: 'language'
            },
            {
                label: `${strings('flowIfKeyword', { environment: 'shared' })} - ${strings('flowElseKeyword', { environment: 'shared' })} - ${strings('flowIfKeyword', { environment: 'shared' })}`,
                snippet: (`${strings('flowIfKeyword', { environment: 'shared' })}` +
                                  ` #{1º condição} ${strings('flowDoKeyword', { environment: 'shared' })}\n` + 
                                  `  #{quando 1º condição}\n${strings('flowElseKeyword', { environment: 'shared' })} ${strings('flowIfKeyword', { environment: 'shared' })}` +
                                  ` #{2º condição} ${strings('flowDoKeyword', { environment: 'shared' })}\n  #{quando 2º condição}\n` + 
                                  `${strings('flowElseKeyword', { environment: 'shared' })} ${strings('flowDoKeyword', { environment: 'shared' })}\n` +
                                  `  #{quando nenhuma condição}\n${strings('flowEndKeyword', { environment: 'shared' })}`).substring(autocomplete.name.length),
                type: 'language'
            },
            {
                label: `${strings('flowFunctionKeyword', { environment: 'shared' })}`,
                snippet: (`${strings('flowFunctionKeyword', { environment: 'shared' })}` +
                                  ` #{nome}(#{parâmetros}) ${strings('flowDoKeyword', { environment: 'shared' })}\n` + 
                                  `  #{fazer}\n${strings('flowEndKeyword', { environment: 'shared' })}`).substring(autocomplete.name.length),
                type: 'language'
            },
            {
                label: `${strings('flowFunctionKeyword', { environment: 'shared' })} anônima`,
                snippet: (`${strings('flowFunctionKeyword', { environment: 'shared' })}` +
                                  ` (#{parâmetros}) ${strings('flowDoKeyword', { environment: 'shared' })}\n` + 
                                  `  #{fazer}\n${strings('flowEndKeyword', { environment: 'shared' })}`).substring(autocomplete.name.length),
                type: 'language'
            },
            {
                label: `${strings('flowFunctionKeyword', { environment: 'shared' })} lambda`,
                snippet: (`${strings('flowFunctionKeyword', { environment: 'shared' })}` +
                                  ` #{nome}(#{parâmetros}): #{fazer}`).substring(autocomplete.name.length),
                type: 'language'
            },
            {
                label: `${strings('flowFunctionKeyword', { environment: 'shared' })} lambda anônima`,
                snippet: (`${strings('flowFunctionKeyword', { environment: 'shared' })}` +
                                  ` (#{parâmetros}): #{fazer}`).substring(autocomplete.name.length),
                type: 'language'
            }
        ]

        console.log(autocomplete)
        if (autocomplete.attributeName === '') {
            const allModules = runtimeModulesDocumentationRef.current
            const modulesOptions = allModules.map(module => ({
                label: `${module.name}`,
                autocompleteText: `${module.name.substring(autocomplete.name.length)}.`,
                description: module?.description,
                type: 'module'
            }))
            options = modulesOptions.concat(languageOptions)
            options = options.filter(({ label }) => label.startsWith(autocomplete.name))

        } else if (autocomplete.attributeName !== '') {
            const builtinModule = runtimeModulesDocumentationRef.current.find(module => module.name === autocomplete.attributeName)

            if (builtinModule) {
                const hasMethods = typeof builtinModule?.methods === 'object'
                const listMethods = hasMethods === true ? Object.values(builtinModule.methods) : []
                const filteredMethods = autocomplete.name !== '' ? listMethods.filter(method => method.name.startsWith(autocomplete.name)) : listMethods
                options = filteredMethods.map(method => {
                    const hasParameters = typeof method?.parameters === 'object'
                    const hasRequiredParameters = (hasParameters === true ? Object.values(method.parameters).filter(parameter=> parameter.required === true) : []).length > 0
                    return {
                        type: 'function',
                        autocompleteText: `${method.name.substring(autocomplete.name.length)}()`,
                        cursorOffset: hasRequiredParameters ? -1 : 0,
                        label: method.name,
                        info: method.description,
                    }
                })
            } 
        } 
        setAutocompleteOptions(options)
    }
    
    function onAutocompleteFunctionOrModule(autocompleteData) {
        const isEditingAFunctionCallOrStructCreation = typeof autocompleteData === 'object' && 
            (autocompleteData.moduleName !== '' || autocompleteData.name !== '')
            //(autocompleteData.currentParameterIndex !== -1 || autocompleteData.currentParameterName !== '')
        if (isEditingAFunctionCallOrStructCreation) {
            const builtinModule = runtimeModulesDocumentationRef.current.find(module => module.name === autocompleteData.moduleName)
            const hasMethods = typeof builtinModule === 'object' && typeof builtinModule?.methods === 'object'
            const method = hasMethods === true && builtinModule.methods[autocompleteData.name] !== undefined ? 
                builtinModule.methods[autocompleteData.name] : {}

            const currentModuleAndFunctionData = {
                method: method,
                currentParameter: undefined
            }
            
            const isEditingTheParametersOfTheFunctionCall = autocompleteData.currentParameterIndex !== -1 || autocompleteData.currentParameterName !== ''
            if (isEditingTheParametersOfTheFunctionCall) {
                const hasParameters = typeof method?.parameters === 'object'
                const listOfParameters = hasParameters === true ? Object.values(method.parameters) : []
                const currentParameterDescription = listOfParameters.find((parameter, index) => {
                    if (autocompleteData.currentParameterName !== '') {
                        return parameter.name === autocompleteData.currentParameterName
                    } else {
                        return index === autocompleteData.currentParameterIndex
                    }
                })

                currentModuleAndFunctionData.currentParameter = currentParameterDescription
            }
            
            setAutocompleteModulesOrFunctions(currentModuleAndFunctionData)
        } else {
            setAutocompleteModulesOrFunctions(null)
        }
    }


    return (
        <Layouts 
        editorContainerRef={editorContainerRef}
        functionsRef={codeEditorFunctionsRef}
        onAutoComplete={onAutoComplete}
        onAutocompleteFunctionOrModule={onAutocompleteFunctionOrModule}
        getFlowContext={getFlowContext}
        onSelect={onCursorMove}
        onBlur={onBlur}
        onFocus={onFocus}
        onChange={onChangeFormula}
        autocompleteOptions={autocompleteOptions}
        autocompleteModulesOrFunctions={autocompleteModulesOrFunctions}
        onClickAutocomplete={onClickAutocomplete}
        />
    )
}