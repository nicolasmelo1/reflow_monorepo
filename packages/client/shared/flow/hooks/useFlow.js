import { useRef, useMemo } from 'react'
import { FlowService } from '../../../../shared/flow'
import { strings } from '../../core'

export default function useFlow() {
    const flowServiceRef = useRef()
    const runtimeModulesDocumentationRef = useRef([])

    const languageOptions = useMemo(() => [
        {
            label: `${strings('flowIfKeyword', { environment: 'shared' })}`,
            autocompleteText: `${strings('flowIfKeyword', { environment: 'shared' })}` +
                              ` #{{${strings('flowIfSnippetCondition')}}} ${strings('flowDoKeyword', { environment: 'shared' })}\n` + 
                              `  #{{${strings('flowIfSnippetWhenTrue')}}}\n${strings('flowEndKeyword', { environment: 'shared' })}`,
            type: 'language',
            isSnippet: true
        },
        {
            label: `${strings('flowIfKeyword', { environment: 'shared' })} - ${strings('flowElseKeyword', { environment: 'shared' })}`,
            autocompleteText: `${strings('flowIfKeyword', { environment: 'shared' })}` +
                              ` #{{${strings('flowIfSnippetCondition')}}} ${strings('flowDoKeyword', { environment: 'shared' })}\n` + 
                              `  #{{${strings('flowIfSnippetWhenTrue')}}}\n${strings('flowElseKeyword', { environment: 'shared' })}` +
                              ` ${strings('flowDoKeyword', { environment: 'shared' })}\n  #{{${strings('flowIfSnippetWhenFalse')}}}\n` + 
                              `${strings('flowEndKeyword', { environment: 'shared' })}`,
            type: 'language',
            isSnippet: true
        },
        {
            label: `${strings('flowIfKeyword', { environment: 'shared' })} - ${strings('flowElseKeyword', { environment: 'shared' })} - ${strings('flowIfKeyword', { environment: 'shared' })}`,
            autocompleteText: `${strings('flowIfKeyword', { environment: 'shared' })}` +
                              ` #{{${strings('flowIfSnippetFirstCondition')}}} ${strings('flowDoKeyword', { environment: 'shared' })}\n` + 
                              `  #{{${strings('flowIfSnippetWhenFirstCondition')}}}\n${strings('flowElseKeyword', { environment: 'shared' })}` +
                              ` ${strings('flowIfKeyword', { environment: 'shared' })} #{{${strings('flowIfSnippetSecondCondition')}}} `+
                              `${strings('flowDoKeyword', { environment: 'shared' })}\n  #{{${strings('flowIfSnippetWhenSecondCondition')}}}\n` + 
                              `${strings('flowElseKeyword', { environment: 'shared' })} ${strings('flowDoKeyword', { environment: 'shared' })}\n` +
                              `  #{{${strings('flowIfSnippetWhenNoCondition')}}}\n${strings('flowEndKeyword', { environment: 'shared' })}`,
            type: 'language',
            isSnippet: true
        },
        {
            label: `${strings('flowFunctionKeyword', { environment: 'shared' })}`,
            autocompleteText: `${strings('flowFunctionKeyword', { environment: 'shared' })}` +
                              ` #{nome}(#{parâmetros}) ${strings('flowDoKeyword', { environment: 'shared' })}\n` + 
                              `  #{fazer}\n${strings('flowEndKeyword', { environment: 'shared' })}`,
            type: 'language',
            isSnippet: true
        },
        {
            label: `${strings('flowFunctionKeyword', { environment: 'shared' })} anônima`,
            autocompleteText: `${strings('flowFunctionKeyword', { environment: 'shared' })}` +
                              ` (#{parâmetros}) ${strings('flowDoKeyword', { environment: 'shared' })}\n` + 
                              `  #{fazer}\n${strings('flowEndKeyword', { environment: 'shared' })}`,
            type: 'language',
            isSnippet: true
        },
        {
            label: `${strings('flowFunctionKeyword', { environment: 'shared' })} lambda`,
            autocompleteText: `${strings('flowFunctionKeyword', { environment: 'shared' })}` +
                              ` #{nome}(#{parâmetros}): #{fazer}`,
            type: 'language',
            isSnippet: true
        },
        {
            label: `${strings('flowFunctionKeyword', { environment: 'shared' })} lambda anônima`,
            autocompleteText: `${strings('flowFunctionKeyword', { environment: 'shared' })}` +
                              ` (#{parâmetros}): #{fazer}`,
            type: 'language',
            isSnippet: true
        }
    ], [])
    
    /**
     * This will initialize the flow language service so we can have all of the flow language features translated
     * and available through the context.
     * 
     * @return {Promise<import('@lezer/language').LanguageSupport>} - The language support for the flow language to use in codemirror.
     */
    async function getFlowContext() {
        const language = 'pt-BR'
        runtimeModulesDocumentationRef.current = []
        
        flowServiceRef.current = await FlowService.initialize(language)
        for (const moduleToRuntime of flowServiceRef.current.context.modulesToRuntime) {
            const documentation = await moduleToRuntime.moduleClass.documentation(language)
            if (![null, undefined].includes(documentation) && typeof documentation === 'object') {
                runtimeModulesDocumentationRef.current.push(documentation)
            }
        }
        return flowServiceRef.current.context
    }

    async function performTest(code) {
        return await flowServiceRef.current.evaluate(code)
    }

    return {
        flowServiceRef,
        runtimeModulesDocumentationRef,
        getFlowContext,
        performTest,
        languageOptions
    }
}