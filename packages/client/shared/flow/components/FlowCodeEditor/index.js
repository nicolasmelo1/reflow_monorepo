import { useRef, useState, useEffect } from 'react'
import { useFlow } from '../../hooks'
import { APP } from '../../../conf'
import { useClickedOrPressedOutside } from '../../../core'
import { delay } from '../../../../../shared/utils'
import Layouts from './layouts'


const defaultDelay = delay(2000)

/**
 * This is different from the other components, most of the logic is on the layout itself and not here.
 * That's because there are lot of particularities between react native and react that we need to address.
 * 
 * @param {object} props - The props for this component
 * @param {undefined | {
 *      current: null | {
 *          dispatchChange:  (newText, { from=undefined, to=undefined, replaceText=false }={}) => void, 
 *          forceFocus: () => void, 
 *          forceBlur: () => void
 *     }
 * }} [props.codeEditorFunctionsRef=undefined] - This is the react useRef object that will hold the functions that we can
 * call on the code editor. For example, changing the text on a given variable, and so on.
 * @param {undefined | {
 *     current: null | (code) => Promise<import('../../../../../shared/flow/builtins/objects').FlowObject>
 * }} [props.evaluateRef=undefined] - This is a useRef object, that will hold the function to evaluate a flow code, whenever
 * you want to evaluate the flow code you will need to call `props.evaluateRef.current(code)`. Remember that
 * this will give you the result as a FlowObject, so you need to convert it to a javascript value in order
 * to use it.
 * @param {undefined | {current: null | import('../../../../../shared/flow/service')}} [props.flowServiceRef=undefined] - This is
 * a ref object that will hold the FlowService instance. With this we can use this outside of this component.
 * @param {undefined | (code) => 
 *      Promise<import('../../../../../shared/flow/builtins/objects').FlowObject>
 * } [props.onChange=undefined] - Callback that is called whenever the code in the editor
 * changes.
 * @param {string} [props.code=''] - The code that will be shown/written inside of the editor.
 * @param {undefined |
 *      ({name: string, attributeName: string, elementAt: number}, function) => Array<{
 *          label: string,
 *          autocompleteText: string,
 *          description: string,
 *          type: string,
 *          rawName: string,
 *          examples: Array<string>,
 *          parameters: Array<{
 *              name: string, 
 *              description: string,
 *              type: string, 
 *              required: boolean
 *          }>,
 *          cursorOffset: number,
 *          isSnippet: boolean
 *      }>
 * } [props.onAutoComplete=undefined] - This function will be called whenever we want to retrieve the autocomplete options
 * this is used to retrieve extra autocomplete options for the user that is bounded to the context where flow is being used.
 * 
 * @return {import('react').ReactElement} - The component that will be rendered.
 */
export default function FlowCodeEditor(props) {
    const initialCode = typeof props.code === 'string' ? props.code : ''
    const codeEditorFunctionsRef = props.codeEditorFunctionsRef !== undefined ? props.codeEditorFunctionsRef : useRef({})
    const forWebEditorRef = useRef()
    const forWebAutocompleteContainerRef = useRef()
    const editorContainerRef = useRef()
    const isInputFocusedRef = useRef(false)
    const cursorPositionRef = useRef({ from: 0, to: 0})
    
    const [isCalculating, setIsCalculating] = useState(false)
    const [flowCode, setFlowCode] = useState(initialCode)
    const [evaluationResult, setEvaluationResult] = useState({ value: undefined, type: '' })
    const [editorHeight, setEditorHeight] = useState(0)
    const [isToLoadAutocompleteOptionsOnBottom, setIsToLoadAutocompleteOptionsOnBottom] = useState(true)
    const [autocompleteOptions, setAutocompleteOptions] = useState([])
    const [hoveringAutocompleteOption, setHoveringAutocompleteOption] = useState(null)
    const [autocompleteModulesOrFunctions, setAutocompleteModulesOrFunctions] = useState(null)
    const { 
        flowServiceRef,
        runtimeModulesDocumentationRef,
        getFlowContext,
        evaluate,
        languageOptions,
        createAutocompleteOptions
    } = useFlow()
    useClickedOrPressedOutside({ customRef: editorContainerRef, callback: () => onToggleInputFocus(false) })
   
    /**
     * / * WEB ONLY * /
     * 
     * Function used for defining the height of the editor for absolute positioning it in the screen, and also defining
     * if the autocomplete options should be rendered in the bottom or the top of the editor.
     */
    function webAutomaticDefineWhereToRenderOptions() {
        const isAutocompleteOptionsDefined = autocompleteOptions.length > 0
        const isAutocompleteModulesOrFunctionsDefined = typeof autocompleteModulesOrFunctions === 'object'
        const isWebApp = APP === 'web'

        if (isWebApp && forWebAutocompleteContainerRef.current &&
            (isAutocompleteOptionsDefined || 
            isAutocompleteModulesOrFunctionsDefined)
        ) {
            const editorRect = forWebEditorRef.current.getBoundingClientRect()
            const optionsContainerRect = forWebAutocompleteContainerRef.current.getBoundingClientRect()
            const maximumHeightOfPage = window.innerHeight
            const bottomPositionOfOptionsContainer = optionsContainerRect.height + editorRect.y + editorRect.height
            const isOptionsContainerBiggerThanWindow = bottomPositionOfOptionsContainer > maximumHeightOfPage
            if (isOptionsContainerBiggerThanWindow) {
                setIsToLoadAutocompleteOptionsOnBottom(false)
            } else {
                setIsToLoadAutocompleteOptionsOnBottom(true)
            }
            const isNewHeightDifferentFromCurrentHeight = editorRect.height !== editorHeight
            if (isNewHeightDifferentFromCurrentHeight) setEditorHeight(editorRect.height)
        }
    }

    /**
     * This is called whenever the user changes the text inside of the code editor. So you can do whatever type of
     * behaviour you want to do.
     * 
     * @param {string} flowCode - The code that the user has written in the editor.
     */
    async function onChangeCode(flowCode) {
        /**
         * Function used for extracting the type and the representation value of a FlowObject.
         * 
         * @param {import('../../../../../shared/flow/builtins/objects').FlowObject} flowObject - The FlowObject 
         * that you want to extract the type and the representation value from.
         * 
         * @return {Promise<{
         *     type: string,
         *     value: *
         * }>} - The type and the representation value of the FlowObject.
         */
        const retrieveValueAndTypeFromFlowObject = async (flowObject) => {
            let type = ''
            let value = undefined
            if (flowObject !== undefined && flowObject._representation_ !== undefined) {
                type = flowObject.type
                value = await(await flowObject._string_())._representation_()
            }
            return { type, value }
        }
        const isOnChangeDefined = typeof props.onChange === 'function'
        if (isOnChangeDefined) {
            setIsCalculating(true)
            const flowObject = await Promise.resolve(props.onChange(flowCode))
            const { value, type } = await retrieveValueAndTypeFromFlowObject(flowObject)
            setIsCalculating(false)
            setEvaluationResult({ value, type })
        } else {
            defaultDelay(() => {
                setIsCalculating(true)
                evaluate(flowCode).then(async result => {
                    const { value, type } = await retrieveValueAndTypeFromFlowObject(result)
                    setIsCalculating(false)
                    setEvaluationResult({ value, type })
                })
            })
        }
        setFlowCode(flowCode)
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
     * @param {object} customAutocompleteParams - Custom autocomplete parameters used for extending and giving extra 
     * functionality to the autocomplete.
     * @param {number | undefined} [customAutocompleteParams.from=undefined] - This is used in conjunction with `to`, if either
     * this or `to` are undefined it will not work as expected. When the `from` is defined, this means we will substitute the text
     * from the position to another position with a new text.
     * @param {number | undefined} [customAutocompleteParams.to=undefined] - This function is used in conjunction with the `from`
     * parameter, if this or the `from` parameter are undefined, it will not work as expected. This is the value that defines to
     * what position the text shoule be substituted with the new text.
     * @param {number | undefined} [customAutocompleteParams.cursorAt=undefined] - After inserting the text you might 
     * want to set the cursor at a specific position in the text editor, this is exactly what this is for.
     * @param {boolean} [customAutocompleteParams.isSnippet=false] - This will add the text as a snippet, being a snippet 
     * means that there will be placeholders that the user needs to move to in order to write what he wants. For example,
     * defining an `if` expression can be a lot easier with a snippet where we add the condition as placeholder and the body also as a placeholder.
     */
    function onClickAutocomplete(label='', { from=undefined, to=undefined, cursorAt=undefined, isSnippet=false }={}) {
        const isToSubstituteFromToPosition = typeof from === 'number' && typeof to === 'number'
        const isToSetCursorAtPosition = typeof cursorAt === 'number'
        if (isSnippet === true) {
            codeEditorFunctionsRef.current.dispatchChange(label, { isSnippet })
        } else if (isToSetCursorAtPosition) {
            codeEditorFunctionsRef.current.dispatchChange(label, { 
                withCursorAt: label.length + cursorPositionRef.current.from + cursorAt,
            })
        } else if (isToSubstituteFromToPosition){
            codeEditorFunctionsRef.current.dispatchChange(label, {
                from,
                to
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
     * / * WEB ONLY * /
     * 
     * This function is called when the window blurs, this means, when the user clicks anywhere outside of the
     * current window. Usually we will only blur the element when the user clicks anywhere ON the window outside 
     * of the element. But for example we can click the devtools, clicking the devtools will make the input lose 
     * focus, on this case we should also blur the input.
     */
    function webOnWindowBlur() {
        onToggleInputFocus(false)
    }

    /**
     * Callback used for when we focus on the input, whenever we focus on the codemirror input this function is called. This will call the `onToggleInputFocus`
     * function that will hold most of the functionality for when the input is focused or when it is blurred.
     */
    function onFocus() {
        onToggleInputFocus(true)
    }

    /**
     * Function used to toggle the focus on the input, when we want to focus on the input we call this input, same thing 
     * if we want to blur on the element.
     * 
     * When we set the input to be blurred, we will force to blur on the editor, but we will also dismiss the autocomplete
     * modules or functions and the autocomplete options.
     * 
     * @param {boolean} [isFocused=!isInputFocused] - True if the input will be focused, false if the input will be blurred.
     */
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
     * To create the autocomplete options we use the `createAutocompleteOptions` function that we created in the `useFlow` hook.
     * 
     * If you want to set custom autocomplete options you need to set a `onAutoComplete` callback function. If an onAutoComplete callback function exists
     * we will retrieve custom values using this hook. Those custom values will be shown ABOVE the default options. There are two things
     * about custom options: WE WILL NOT take out what the user wrote. For example, by default if wrote HT and the autocomplete text is 
     * HTTP, when the user clicks this options it WON'T SHOW HTHTTP, instead it should be `HTTP`, so on this case, if the user
     * wrote HT, the autocomplete text will be `TP`. This behaviour will not exist on custom options, you will need to handle this 
     * outside of this function.
     * 
     * Also, this DOES NOT handle filtering of custom autocomplete options. You need to handle it in your `onAutoComplete` callback
     * 
     * @param {{name: string, attributeName: string, elementAt: number}} autocomplete - The autocomplete object that holds the informations 
     * needed to filter the autocomplete options.
     * By default, `name` is filled with whatever the user types. The `attributeName` is the name of the attribute that the user is in. For example: 
     * ```
     * HTTP.
     * ```
     * The attribute name is "HTTP", so we need to display the functions from the HTTP module.
     */
    function onAutoComplete(autocomplete) {
        let options = []
        let customOptions = []
        const isOnAutocompleteDefined = typeof props.onAutoComplete === 'function'
        if (isOnAutocompleteDefined) {
            const customAutocompleteOptions = props.onAutoComplete(autocomplete, createAutocompleteOptions)
            if (Array.isArray(customAutocompleteOptions)) customOptions = customAutocompleteOptions
        }

        if (autocomplete.attributeName === '') {
            const allModules = runtimeModulesDocumentationRef.current
            const modulesOptions = allModules.map(module => {
                const moduleDescription = typeof module?.description === 'string' ? module.description : ''
                return createAutocompleteOptions(
                    `${module.name}.`, 
                    module.name,
                    moduleDescription,
                    'module'
                )
            })
            const modulesAndLanguageOptions = modulesOptions.concat(languageOptions)
            options = options.concat(modulesAndLanguageOptions.filter(option => option.label.startsWith(autocomplete.name)))

        } else if (autocomplete.attributeName !== '') {
            const builtinModule = runtimeModulesDocumentationRef.current.find(module => module.name === autocomplete.attributeName)

            if (builtinModule) {
                const hasMethods = typeof builtinModule?.methods === 'object'
                const listMethods = hasMethods === true ? Object.values(builtinModule.methods) : []
                const filteredMethods = autocomplete.name !== '.' ? listMethods.filter(method => method.name.startsWith(autocomplete.name)) : listMethods
                options = options.concat(
                    filteredMethods.map(method => {
                        const hasParameters = typeof method?.parameters === 'object'
                        const hasRequiredParameters = (hasParameters === true ? Object.values(method.parameters).filter(parameter=> parameter.required === true) : []).length > 0
                        const methodDescription = typeof method?.description === 'string' ? method.description : ''
                        const parameters = hasParameters ? Object.values(method.parameters) : []
                        const examples = Array.isArray(method?.examples) ? method.examples : []
                        const cursorOffset = hasRequiredParameters ? -1 : 0
                        return createAutocompleteOptions(
                            `${method.name}()`,
                            `${method.name}()`,
                            methodDescription,
                            'function',
                            { 
                                rawName: method.name, 
                                parameters: parameters, 
                                examples: examples,
                                cursorOffset: cursorOffset
                            }
                        )
                    })
                )
            } 
        } 
        
        // See that this creates a new object, this is really important. Because if we didn't do this and changed
        // the original object we would be changing the original object, meaning that, if we search for "if " for example,
        // we will remove this part from the `autocompleteText` of the original text, so the next time we type only "i", 
        // the "if " part will be ~cut off~. Because you would be changing the actual object directly.
        options = options.map(option => {
            const filteredAutocompleteText = option.autocompleteText.startsWith(autocomplete.name) ? 
                option.autocompleteText.substring(autocomplete.name.length) : option.autocompleteText
            return {
                ...option,
                autocompleteText: filteredAutocompleteText
            }
        })
        options = customOptions.concat(options)

        const isOptionsNotEmpty = options.length > 0
        const isFirstOptionDifferentFromExistingHoveringOption = hoveringAutocompleteOption === null ||
            (isOptionsNotEmpty && JSON.stringify(options[0]) !== JSON.stringify(hoveringAutocompleteOption))
        if (isOptionsNotEmpty && isFirstOptionDifferentFromExistingHoveringOption) {
            setHoveringAutocompleteOption(options[0])
        }

        setAutocompleteOptions([...options])
    }
    
    /**
     * This will help the user when he is filling a module or a function. Right now only functions.
     * It works similarly to Excel, when the user is typing a function we will show the current parameter
     * he is filling the function with, we show if it is required and also the description of what the parameter
     * he is filling refers to.
     * This makes it easy to understand how flow works and makes it fairly easy to write flow code.
     * 
     * @param {object} autocompleteFunctionOrModuleData - The data of the function or module that the user is filling.
     * @param {string} [autocompleteFunctionOrModuleData.name=''] - The name of the function inside of a module.
     * For example on "HTTP.get()" this will be "name".
     * @param {string} [autocompleteFunctionOrModuleData.moduleName=''] - The name of the module.
     * For example on "HTTP.get()" this will be "HTTP".
     * @param {number} [autocompleteFunctionOrModuleData.currentParameterIndex=0] - The current parameter index that the user
     * is filling. For example on "HTTP.get('https://www.google.com', |)" (Where '|' is the cursor) this will be 1. because the
     * index 0 is the 'https://www.google.com' and since the cursor is after the ',', then this means we are filling 
     * the second parameter.
     * @param {number} [autocompleteFunctionOrModuleData.currentParameterName=''] - The current parameter name that the user is filling.
     * For example: HTTP.get has the following parameters: ['url', 'parmeters', 'headers', 'basic_auth']. But the user just want to set up
     * the url and the `headers`, he can do this by:
     * ```
     * HTTP.get('https://www.google.com', headers={'Content-Type': 'application/json'} |)
     * ```
     * ^ This will show the current parameter name that the user is filling as 'headers', although it is on parameter index position 1.
     */
    function onAutocompleteFunctionOrModule(
        { name='', moduleName='', currentParameterIndex=0, currentParameterName='' }={}
    ) {
        const isEditingAFunctionCallOrStructCreation = moduleName !== '' || name !== ''
        if (isEditingAFunctionCallOrStructCreation) {
            const builtinModule = runtimeModulesDocumentationRef.current.find(module => module.name === moduleName)
            const hasMethods = typeof builtinModule === 'object' && typeof builtinModule?.methods === 'object'
            const method = hasMethods === true && builtinModule.methods[name] !== undefined ? 
                builtinModule.methods[name] : undefined

            if (method !== undefined) {
                const currentModuleAndFunctionData = {
                    method: method,
                    currentParameter: undefined
                }
                
                const isEditingTheParametersOfTheFunctionCall = currentParameterIndex !== -1 || currentParameterName !== ''
                if (isEditingTheParametersOfTheFunctionCall) {
                    const hasParameters = typeof method?.parameters === 'object'
                    const listOfParameters = hasParameters === true ? Object.values(method.parameters) : []
                    const currentParameterDescription = listOfParameters.find((parameter, index) => {
                        const isCurrentParameterNameNotEmpty = currentParameterName !== ''
                        if (isCurrentParameterNameNotEmpty) {
                            return parameter.name === currentParameterName
                        } else {
                            return index === currentParameterIndex
                        }
                    })

                    currentModuleAndFunctionData.currentParameter = currentParameterDescription
                }
                
                setAutocompleteModulesOrFunctions(currentModuleAndFunctionData)
                return undefined
            }
        }
        setAutocompleteModulesOrFunctions(null)
    }

    /**
     * Callback supposed to be called when the user hovers over an option. On mobile defines this can be a callback for a
     * 'onPress' event, since it doesn't have hovering behaviour.
     * 
     * What this does is that this retrieves the index of the option that is being displayed, and then set it as the current 
     * hovering autocomplete option.
     * 
     * @param {number} optionIndex - The index of the option that is being hovered over.
     */
    function onHoverAutocompleteOption(optionIndex) {
        setHoveringAutocompleteOption(autocompleteOptions[optionIndex])
    }

    useEffect(() => {
        if (typeof flowCode === 'string' && flowCode !== '') onChangeCode(flowCode)
        if (APP === 'web') window.addEventListener('blur', webOnWindowBlur)
        return () => {
            if (APP === 'web') window.removeEventListener('blur', webOnWindowBlur)
        }
    }, [])

    useEffect(() => {
        const doesPropsForEvaluateWereDefined = typeof props.evaluateRef === 'object' && 
            typeof props.evaluateRef?.current !== 'function'
        const isEvaluateFunctionDefined = typeof evaluate === 'function'
        if (doesPropsForEvaluateWereDefined && isEvaluateFunctionDefined) {
            props.evaluateRef.current = evaluate
        }  
    }, [props.evaluateRef, evaluate])

    useEffect(() => {
        const doesPropsForFlowServiceWereDefined = typeof props.flowServiceRef === 'object' && props.flowServiceRef?.current === null        
        const isFlowServiceDefined = typeof flowServiceRef === 'object' && typeof flowServiceRef?.current !== undefined
        if (doesPropsForFlowServiceWereDefined && isFlowServiceDefined) {
            props.flowServiceRef.current = flowServiceRef.current
        }
    }, [props.flowServiceRef, flowServiceRef])

    useEffect(() => {
        webAutomaticDefineWhereToRenderOptions()
    }, [autocompleteOptions, autocompleteModulesOrFunctions, evaluationResult, flowCode])

    useEffect(() => {
        const isCodeFromParentDifferentFromLocalCode = typeof props.code === 'string' && props.code !== flowCode
        if (isCodeFromParentDifferentFromLocalCode) {
            setFlowCode(props.code)
        }
    }, [props.code])

    return (
        <Layouts 
        forWebEditorRef={forWebEditorRef}
        forWebAutocompleteContainerRef={forWebAutocompleteContainerRef}
        editorContainerRef={editorContainerRef}
        functionsRef={codeEditorFunctionsRef}
        editorHeight={editorHeight}
        isToLoadAutocompleteOptionsOnBottom={isToLoadAutocompleteOptionsOnBottom}
        isCalculating={isCalculating}
        evaluationResult={evaluationResult}
        onAutoComplete={onAutoComplete}
        onHoverAutocompleteOption={onHoverAutocompleteOption}
        onAutocompleteFunctionOrModule={onAutocompleteFunctionOrModule}
        getFlowContext={getFlowContext}
        initialCode={flowCode}
        onSelect={onCursorMove}
        onBlur={onBlur}
        onFocus={onFocus}
        onChange={onChangeCode}
        hoveringAutocompleteOption={hoveringAutocompleteOption}
        autocompleteOptions={autocompleteOptions}
        autocompleteModulesOrFunctions={autocompleteModulesOrFunctions}
        onClickAutocomplete={onClickAutocomplete}
        />
    )
}