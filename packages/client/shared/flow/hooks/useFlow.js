import { useRef } from 'react'
import { FlowService } from '../../../../shared/flow'

export default function useFlow() {
    const flowServiceRef = useRef()
    const runtimeModulesDocumentationRef = useRef([])

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
        performTest
    }
}