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
        performTest,
        languageOptions
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

    /**
     * Maps the movement of the cursor in the text editor. Thiw way we can know the current position of the cursor
     * and this enables us to add text in the middle of the text. This is a callback for the `onSelect` function inside of
     * `useCodemirror` hook.
     * 
     * @param {object} cursorPosition - The position of the cursor inside of the text editor.
     * @param {number} [cursorPosition.from=0] - The index of the starting position of the cursor inside of the editor.
     * @param {number} [cursorPosition.to=0] - The index of the end position of the cursor inside of the editor.
     */
    function onCursorMove({ from=0, to=0 }={}) {
        cursorPositionRef.current = { from, to }
    }

    /**
     * Function called when clicking a option inside of the autocomplete menu.
     * 
     * @param {string} [label=''] - By default the label is always defined, this is the text that will be inserted in the editor.
     * @param {object} customAutocompleteParams - Custom autocomplete parameters used for extending and giving extra functionality to the autocomplete.
     * @param {number | undefined} [customAutocompleteParams.cursorAt=undefined] - After inserting the text you might want to set the cursor at a specific
     * position in the text editor, this is exactly what this is for.
     * @param {boolean} [customAutocompleteParams.isSnippet=false] - This will add the text as a snippet, being a snippet means that there will be placeholders
     * that the user needs to move to in order to write what he wants. For example, defining an `if` expression can be a lot easier with a snippet
     * where we add the condition as placeholder and the body also as a placeholder.
     */
    function onClickAutocomplete(label='', { cursorAt=undefined, isSnippet=false }={}) {
        if (isSnippet === true) {
            codeEditorFunctionsRef.current.dispatchChange(label, { isSnippet })
        } else if (cursorAt !== undefined) {
            codeEditorFunctionsRef.current.dispatchChange(label, { 
                withCursorAt: label.length + cursorPositionRef.current.from + cursorAt,
            })
        } else {
            codeEditorFunctionsRef.current.dispatchChange(label)
        }
    }

    /**
     * Callback that will be called whenever the input blurs. We see that when this happens, if the editor is focused, we will force to focus again on the
     * input.
     * 
     * The problem is: The autocomplete behaviour was created by us, it's not something provided by default from codemirror. So whenever we click outside of the
     * codemirror editor the editor blurs. This means that when we click one of the autocomplete options, the editor will blur, so if we type something in the keyboard
     * after clicking the autocomplete option, nothing will appear, that's because the codemirror editor will not be focused.
     */
    function onBlur() {
        if (isInputFocusedRef.current === true) codeEditorFunctionsRef.current.forceFocus()
    }

    /**
     * Callback used for when we focus on the input, whenever we focus on the codemirror input this function is called. This will call the `onToggleInputFocus`
     * function that will hold most of the functionality for when the input is focused or when it is blurred.
     */
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

        if (autocomplete.attributeName === '') {
            const allModules = runtimeModulesDocumentationRef.current
            const modulesOptions = allModules.map(module => ({
                label: `${module.name}`,
                autocompleteText: `${module.name}.`,
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
                        autocompleteText: `${method.name}()`,
                        cursorOffset: hasRequiredParameters ? -1 : 0,
                        label: method.name,
                        info: method.description,
                    }
                })
            } 
        } 

        options = options.map(option => {
            option.autocompleteText = option.autocompleteText.substring(autocomplete.name.length)
            return option
        })
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