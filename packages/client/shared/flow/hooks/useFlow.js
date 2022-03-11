import { useRef, useMemo } from 'react'
import { FlowService } from '../../../../shared/flow'
import { strings } from '../../core'

export default function useFlow() {
    const flowServiceRef = useRef(null)
    const runtimeModulesDocumentationRef = useRef([])

    // This makes more sense in production/when debugging in the app. Here you might be confused of all of those strings, and it
    // might not make any sense.
    const languageOptions = useMemo(() => {
        const autocompleteIfLabel = `${strings('flowIfKeyword', { environment: 'shared' })}`
        const autocompleteIfSnippet = `${strings('flowIfKeyword', { environment: 'shared' })}` +
            ` #{${strings('flowIfSnippetCondition')}} ${strings('flowDoKeyword', { environment: 'shared' })}\n` + 
            `  #{${strings('flowIfSnippetWhenTrue')}}\n${strings('flowEndKeyword', { environment: 'shared' })}`

        const autocompleteIfElseLabel = `${strings('flowIfKeyword', { environment: 'shared' })} - ` +
            `${strings('flowElseKeyword', { environment: 'shared' })}`
        const autocompleteIfElseSnippet = `${strings('flowIfKeyword', { environment: 'shared' })}` +
            ` #{${strings('flowIfSnippetCondition')}} ${strings('flowDoKeyword', { environment: 'shared' })}\n` + 
            `  #{${strings('flowIfSnippetWhenTrue')}}\n${strings('flowElseKeyword', { environment: 'shared' })}` +
            ` ${strings('flowDoKeyword', { environment: 'shared' })}\n  #{${strings('flowIfSnippetWhenFalse')}}\n` + 
            `${strings('flowEndKeyword', { environment: 'shared' })}`

        const autocompleteIfElseIfLabel = `${strings('flowIfKeyword', { environment: 'shared' })} - ` + 
            `${strings('flowElseKeyword', { environment: 'shared' })} - ${strings('flowIfKeyword', { environment: 'shared' })}`
        const autocompleteIfElseIfSnippet = `${strings('flowIfKeyword', { environment: 'shared' })}` +
            ` #{${strings('flowIfSnippetFirstCondition')}} ${strings('flowDoKeyword', { environment: 'shared' })}\n` + 
            `  #{${strings('flowIfSnippetWhenFirstCondition')}}\n${strings('flowElseKeyword', { environment: 'shared' })}` +
            ` ${strings('flowIfKeyword', { environment: 'shared' })} #{${strings('flowIfSnippetSecondCondition')}} `+
            `${strings('flowDoKeyword', { environment: 'shared' })}\n  #{${strings('flowIfSnippetWhenSecondCondition')}}\n` + 
            `${strings('flowElseKeyword', { environment: 'shared' })} ${strings('flowDoKeyword', { environment: 'shared' })}\n` +
            `  #{${strings('flowIfSnippetWhenNoCondition')}}\n${strings('flowEndKeyword', { environment: 'shared' })}`
        
        const autocompleteFunctionLabel = `${strings('flowFunctionKeyword', { environment: 'shared' })}`
        const autocompleteFunctionSnippet = `${strings('flowFunctionKeyword', { environment: 'shared' })}` +
            ` #{${strings('flowFunctionSnippetName')}}(#{${strings('flowFunctionSnippetParameters')}}) `+
            `${strings('flowDoKeyword', { environment: 'shared' })}\n` + 
            `  #{${strings('flowFunctionSnippetDo')}}\n${strings('flowEndKeyword', { environment: 'shared' })}`
        
        const autocompleteAnonymousFunctionLabel = `${strings('flowFunctionKeyword', { environment: 'shared' })} ${strings('flowFunctionAnonymousName')}`
        const autocompleteAnonymousFunctionSnippet = `${strings('flowFunctionKeyword', { environment: 'shared' })}` +
            ` (#{${strings('flowFunctionSnippetParameters')}}) ${strings('flowDoKeyword', { environment: 'shared' })}\n` + 
            `  #{${strings('flowFunctionSnippetDo')}}\n${strings('flowEndKeyword', { environment: 'shared' })}`
        
        const autocompleteLambdaFunctionLabel =  `${strings('flowFunctionKeyword', { environment: 'shared' })} ${strings('flowFunctionLambdaName')}`
        const autocompleteLambdaFunctionSnippet = `${strings('flowFunctionKeyword', { environment: 'shared' })}` +
            ` #{${strings('flowFunctionSnippetName')}}(#{${strings('flowFunctionSnippetParameters')}}): ` +
            `#{${strings('flowFunctionSnippetDo')}}`

        const autocompleteAnonymousLambdaFunctionLabel = `${strings('flowFunctionKeyword', { environment: 'shared' })} ` +
            `${strings('flowFunctionLambdaName')} ${strings('flowFunctionAnonymousName')}`
        const autocompleteAnonymousLambdaFunctionSnippet = `${strings('flowFunctionKeyword', { environment: 'shared' })}` +
        ` (#{${strings('flowFunctionSnippetParameters')}}): #{${strings('flowFunctionSnippetDo')}}`
        
        return [
            createAutocompleteOptions(
                autocompleteIfSnippet,
                autocompleteIfLabel,
                'teste',
                'language',
                { isSnippet: true }
            ),
            createAutocompleteOptions(
                autocompleteIfElseSnippet,
                autocompleteIfElseLabel,
                'teste',
                'language',
                { isSnippet: true }
            ),
            createAutocompleteOptions(
                autocompleteIfElseIfSnippet,
                autocompleteIfElseIfLabel,
                'teste',
                'language',
                { isSnippet: true }
            ),
            createAutocompleteOptions(
                autocompleteFunctionSnippet,
                autocompleteFunctionLabel,
                'teste',
                'language',
                { isSnippet: true }
            ),
            createAutocompleteOptions(
                autocompleteAnonymousFunctionSnippet,
                autocompleteAnonymousFunctionLabel,
                'teste',
                'language',
                { isSnippet: true }
            ),
            createAutocompleteOptions(
                autocompleteLambdaFunctionSnippet,
                autocompleteLambdaFunctionLabel,
                'teste',
                'language',
                { isSnippet: true }
            ),
            createAutocompleteOptions(
                autocompleteAnonymousLambdaFunctionSnippet,
                autocompleteAnonymousLambdaFunctionLabel,
                'teste',
                'language',
                { isSnippet: true }
            )
       ]
    }, [])
    
    /**
     * Function used for creating autocomplete options for the selector, while the user is typing on the editor we will
     * show options for him to choose so the experience while writing formulas will be more user friendly and easily. Also
     * the user is able to understand how flow works by using the autocomplete options only and not needing to rely on 
     * any specific and long documentation.
     * 
     * @param {string} autocompleteText - The text that will be used in the editor when the user clicks the autocomplete option.
     * For example on the selector we can show `HTTP` as the title for the autocomplete option but when he clicks it is `HTTP.`
     * @param {string} label - The label of the autocomplete option, it is the text that will be show in the list. It's supposed
     * to be something simple and that people can read easily.
     * @param {string} description - The description of the autocomplete option, this description will not be shown in the list,
     * when the user hover over the option with the mouse we will show the details of this option, this description is supposed 
     * to explain what the model/function/language snippet does.
     * @param {'language'|'function'|'module'} type - There are three types of autocomplete options at the current time:
     * language snippets (like creating an if statement, a function, and so on.), function snippets, this is one of the most important
     * because it's similar to excel. And last but not least, module snippets. Modules are used to organize the functions.
     * @param {object} extraOptions - This is an object that contains extra options for the autocomplete options list, it's something
     * that will be specific for some types of autocomplete options.
     * @param {string | undefined} [extraOptions.rawName=undefined] - The raw name of the autocomplete option, this is specially useful
     * for functions. Functions will be usually shown as `functionName()`, but, specially for function description we need to show all
     * of the parameters colorized. For that we need this rawName, which will be just the function name.
     * @param {Array<string>} [extraOptions.examples=[]] - The examples of the usages of this function/language/module. It's an array
     * of strings where each array is an example.
     * @param {Array<{
     *      name: string, 
     *      description: string,
     *      type: string,
     *      required: boolean
     * }>} [extraOptions.parameters=[]] - The parameters of functions so we can display them nicely in the function explanation.
     * @param {number} [cursorOffset=0] - This is used for when you click the option and you don't want the cursor to be at the end
     * of the string. For example, when click on function autocomplete options, we don't want the cursor to be `.get()|` (where '|' 
     * is the cursor), but on `.get(|)`, that's why we use this.
     * @param {boolean} [isSnippet=false] - This is used for when we want to show the autocomplete option as a snippet. This will make
     * it easy for users to fill the snippet with their own logic.
     * 
     * @returns {{
     *      label: string,
     *      autocompleteText: string,
     *      description: string,
     *      type: string,
     *      rawName: string,
     *      examples: Array<string>,
     *      parameters: Array<{
     *          name: string, 
     *          description: string,
     *          type: string,
     *          required: boolean
     *      }>,
     *      cursorOffset: number,
     *      isSnippet: boolean
     * }} - Returns all of the parameters formated nicely in an object.
     */
    function createAutocompleteOptions(
        autocompleteText, label, description, type, 
        { rawName=undefined, examples=[], parameters=[], cursorOffset=0, isSnippet=false}={}
    ) {
        const validAutocompleteOptionTypes = ['language', 'function', 'module']
        const isTypeValid = validAutocompleteOptionTypes.includes(type)
        if (isTypeValid) {
            const isRawNameDefined = typeof rawName === 'string'
            if (!isRawNameDefined) rawName = label

            return {
                label,
                autocompleteText,
                description,
                type,
                rawName,
                examples,
                parameters,
                cursorOffset,
                isSnippet
            }
        } else {
            throw new Error(`Invalid autocomplete option type: ${type}, should be one of ${validAutocompleteOptionTypes.join(', ')}`)
        }
    }

    /**
     * This will initialize the flow language service so we can have all of the flow language features translated
     * and available through the context.
     * 
     * @return {Promise<import('@lezer/language').LanguageSupport>} - The language support for the flow language to use in codemirror.
     */
    async function getFlowContext() {
        if (flowServiceRef.current === null) {
            const language = 'pt-BR'
            runtimeModulesDocumentationRef.current = []
            
            flowServiceRef.current = await FlowService.initialize(language)
            for (const moduleToRuntime of flowServiceRef.current.context.modulesToRuntime) {
                const documentation = await moduleToRuntime.moduleClass.documentation(language)
                if (![null, undefined].includes(documentation) && typeof documentation === 'object') {
                    runtimeModulesDocumentationRef.current.push(documentation)
                }
            }
        }
        return flowServiceRef.current.context
    }

    /**
     * Performs a test on the given code. A test means, it will evaluate the result of a flow program.
     * 
     * @param {string} code - The code to be evaluated in the FlowService.
     * 
     * @returns {Promise<import('../../../../shared/flow/builtins/objects').FlowObject} - Returns a flow object which is
     * the result of the function
     */
    async function evaluate(code) {
        return await flowServiceRef.current.evaluate(code)
    }

    return {
        flowServiceRef,
        runtimeModulesDocumentationRef,
        getFlowContext,
        evaluate,
        languageOptions,
        createAutocompleteOptions
    }
}