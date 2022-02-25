import { useRef } from 'react'
import flowLanguageParser from '../utils/flowLanguage'
import useCodemirror from './useCodemirror'
import {
    LRLanguage, LanguageSupport,
    continuedIndent, indentNodeProp,
    foldNodeProp, foldInside, syntaxTree
} from "@codemirror/language"
import { styleTags, tags as t } from "@codemirror/highlight"
import { FlowService } from '../../../../shared/flow'
import { visualize, Color, defaultTheme } from '@colin_t/lezer-tree-visualizer'

export default function useFlow({ 
    dispatchCallback, code='', getLanguagePack=undefined,
    onAutoComplete=undefined, onAutocompleteFunctionOrModule=undefined,
    onBlur=undefined, onFocus=undefined
} = {}) {
    const flowServiceRef = useRef()
    const runtimeModulesDocumentationRef = useRef([])
    const { editorRef, editorView, dispatchChange } = useCodemirror({
        languagePack: getLanguagePack === undefined ? onInitializeLanguagePack : getLanguagePack, 
        defaultCode: code,
        dispatchCallback,
        autocompleteCallback: autocomplete,
        onBlurCallback: onBlur,
        onFocusCallback: onFocus
    })

    function autocomplete(state) {
        const fromPosition = state.selection.ranges[0].from
        const currentNode = syntaxTree(state).resolveInner(fromPosition, -1)
 
        function traverseAndCheckIfNodeInNodeTypes(node, nodeTypes) {
            if (node !== null && nodeTypes.includes(node.name)) {
                return {
                    name: node.name,
                    node: node
                }
            }
            else if (node === null || node.parent === undefined) {
                return {
                    name: '',
                    node: undefined
                }
            }
            else return traverseAndCheckIfNodeInNodeTypes(node.parent, nodeTypes)
        }
        
        function getCurrentParameterIndexAndParameterName(openBracket, closeBracket, node) {
            let currentParameterName = ''
            let currentParameterIndex = -1
            const openBracketNode = node.getChild(openBracket)
            const closeBracketNode = node.getChild(closeBracket)
            const doesOpenBracketExistAndIsCursorInside = ![null,undefined].includes(openBracketNode) && fromPosition >= openBracketNode.to
            const isCloseBracketNotDefined = [null,undefined].includes(closeBracketNode)
            const doesCloseBracketExistAndIsCursorInside = ![null,undefined].includes(closeBracketNode) && fromPosition <= closeBracketNode.from
            if (doesOpenBracketExistAndIsCursorInside && (isCloseBracketNotDefined || doesCloseBracketExistAndIsCursorInside)) {
                currentParameterIndex = 0
                const positionalArgumentSeparators = node.getChildren('PositionalArgumentSeparator')
                for (const positionalArgumentSeparator of positionalArgumentSeparators) {
                    if (fromPosition < positionalArgumentSeparator.to) break
                    else currentParameterIndex++
                }

                const namedParameters = node.getChildren('Parameters')
                const doesParameterExistForCurrentParameterIndex = namedParameters[currentParameterIndex] !== undefined
                const isFirstChildAVariableDefinitionNode = doesParameterExistForCurrentParameterIndex && 
                    namedParameters[currentParameterIndex].firstChild.name === 'VariableDefinition'
                if (isFirstChildAVariableDefinitionNode) {
                    const variableNode = namedParameters[currentParameterIndex].firstChild
                    currentParameterName = state.sliceDoc(variableNode.from, variableNode.to)
                }
            }
            return {
                currentParameterName,
                currentParameterIndex
            }
        }

        if (onAutocompleteFunctionOrModule !== undefined) {
            const { name: nodeName, node: functionOrModuleNode } = traverseAndCheckIfNodeInNodeTypes(currentNode, ['FunctionCall', 'Struct'])

            if (nodeName === 'FunctionCall') {
                const currentParameterIndexAndName = getCurrentParameterIndexAndParameterName('(', ')', functionOrModuleNode)
                const firstChild = functionOrModuleNode.firstChild
                
                let moduleName = null
                const {node: attributeNode} = traverseAndCheckIfNodeInNodeTypes(currentNode, ['Attribute'])
                if (attributeNode !== undefined) moduleName = state.sliceDoc(attributeNode.firstChild.from, attributeNode.firstChild.to)
                const functionName = state.sliceDoc(firstChild.from, firstChild.to)

                onAutocompleteFunctionOrModule({
                    moduleName: moduleName,
                    name: functionName,
                    ...currentParameterIndexAndName,
                })
            } else if (nodeName === 'Struct') {
                const currentParameterIndexAndName = getCurrentParameterIndexAndParameterName('{', '}', functionOrModuleNode)
                const firstChild = functionOrModuleNode.firstChild
                
                const moduleName = state.sliceDoc(firstChild.from, firstChild.to)
                onAutocompleteFunctionOrModule({
                    moduleName: '',
                    name: moduleName,
                    ...currentParameterIndexAndName
                })
            } else {
                onAutocompleteFunctionOrModule({
                    moduleName: '',
                    name: '',
                    currentParameterIndex: -1,
                    currentParameterName: ''
                })
            }
        }

        if (onAutoComplete !== undefined) {
            const { node: attributeNode } = traverseAndCheckIfNodeInNodeTypes(currentNode, ['Attribute'])
            const attributeName = attributeNode !== undefined ? state.sliceDoc(attributeNode.firstChild.from, attributeNode.firstChild.to) : ''
            if (currentNode.name === 'Script') {
                onAutoComplete({
                    name: '',
                    attributeName
                })
            } else if (currentNode.name === 'Variable') {
                const searching = state.sliceDoc(currentNode.from, currentNode.to)
                //const { name: nodeName, node: functionOrModuleNode } = traverseAndCheckIfNodeInNodeTypes(currentNode, ['FunctionCall', 'Struct'])
                onAutoComplete({
                    name: searching,
                    attributeName
                })
            } else {
                onAutoComplete({
                    name: '',
                    attributeName
                })
            }
        }
    }

    /**
     * Initializes the flow language parser so we can edit here directly, we will be able to edit how the code is styled and parsed
     * from here directly.
     * 
     * This gives us a simple and smooth debug and development experience when managing flow in the front-end.
     * 
     * @param {import('../../../../shared/flow/context')} flowContext - The flow context to use in the parser.
     * 
     * @returns {LanguageSupport} - The language support for the flow language.
     */
    async function flowLanguagePack(flowContext) {
        const context = {
            includes: flowContext.keyword.includesKeyword, 
            conjunction: flowContext.keyword.conjunctionKeyword, 
            disjunction: flowContext.keyword.disjunctionKeyword, 
            inversion: flowContext.keyword.inversionKeyword, 
            equality: flowContext.keyword.equalityKeyword, 
            inequality: flowContext.keyword.inequalityKeyword,
            blockDo: flowContext.keyword.blockContext.doKeyword, 
            blockEnd: flowContext.keyword.blockContext.endKeyword, 
            nullValue: flowContext.keyword.nullKeyword, 
            booleanTrue: flowContext.keyword.booleanContext.trueKeyword, 
            booleanFalse: flowContext.keyword.booleanContext.falseKeyword, 
            ifIf: flowContext.keyword.ifContext.ifKeyword, 
            ifElse: flowContext.keyword.ifContext.elseKeyword, 
            functionKeyword: flowContext.keyword.functionKeyword, 
            returnKeyword: flowContext.keyword.returnKeyword, 
            raiseKeyword: flowContext.keyword.errorContext.raiseKeyword,
            tryKeyword: flowContext.keyword.errorContext.tryKeyword, 
            catchKeyword: flowContext.keyword.errorContext.catchKeyword, 
            moduleKeyword: flowContext.keyword.moduleKeyword, 
            decimalPointSeparator: flowContext.decimalPointSeparator, 
            positionalArgumentSeparator: flowContext.positionalArgumentSeparator, 
            dateCharacter: flowContext.datetime.dateCharacter, 
            dateFormat: flowContext.datetime.dateFormat, 
            hourFormat: flowContext.datetime.hourFormat, 
            documentationKeyword: flowContext.keyword.documentationKeyword
        }
        const parser = flowLanguageParser(context)
        const operatorKeywords = `${context.conjunction} ${context.disjunction} ${context.equality} ${context.inversion} ${context.includes}`
        const controlKeywords = `${context.blockDo} ${context.blockEnd} ${context.ifIf} ${context.ifElse} ${context.tryKeyword} ${context.catchKeyword} ` +
                                `${context.returnKeyword} ${context.raiseKeyword}`
        const definitionKeywords = `${context.functionKeyword} ${context.moduleKeyword}`
        const styles = {
            [operatorKeywords]: t.operatorKeyword,
            [controlKeywords]: t.controlKeyword,
            [definitionKeywords]: t.definitionKeyword,
            Boolean: t.bool,
            String: t.string,
            Number: t.number,
            Variable: t.variableName,
            VariableDefinition: t.definition(t.variableName),
            "AddOperators ProductOperators": t.arithmeticOperator,
            "BooleanOperators": t.compareOperator,
            LineComment: t.lineComment,
            DocumentationBlockComment: t.blockComment,
            [context.nullValue]: t.null,
            "FunctionDefinitionExpression/VariableDefinition": t.function(t.definition(t.variableName)),
            "( )": t.paren,
            "[ ]": t.squareBracket,
            "{ }": t.brace,
            ",": t.separator,
            "=": t.definitionOperator
        }

        const flowLanguage = LRLanguage.define({
            parser: parser.configure({
                props: [
                    indentNodeProp.add({
                        IfExpression: continuedIndent({except: new RegExp(`^\\s*(${context.blockEnd}|${context.ifElse}\b)`)}),
                        ElseExpression: continuedIndent({except: new RegExp(`^\\s*(${context.blockEnd}|${context.ifElse}\b)`)}),
                        TryExpression: continuedIndent({except: new RegExp(`^\\s*(${context.blockEnd}|${context.catchKeyword}\b)`)}),
                        CatchExpression: continuedIndent({except: new RegExp(`^\\s*(${context.blockEnd}\b)`)}),
                        List: continuedIndent({except: /^\s*(\]\b)/}),
                        Dict: continuedIndent({except: /^\s*(\}\b)/}),
                        FunctionDefinitionExpression: continuedIndent({ except: new RegExp(`^\\s*(${context.blockEnd}\b)`)})
                    }),
                    foldNodeProp.add({
                        "ElseExpression IfExpression FunctionDefinitionExpression": foldInside,
                    }),
                    styleTags(styles)
                ]
            }),
            languageData: {
                closeBrackets: { brackets: ["(", "[", "{", context.blockDo, "'", '"', '`'] },
                commentTokens: {line: "#", block: {open: "/*", close: "*/"}},
                indentOnInput: new RegExp(`^\\s*(${context.blockDo}|${context.blockEnd}|${context.ifElse})$`),
            }
        })

        return new LanguageSupport(flowLanguage, [])
    }

    /**
     * This will initialize the flow language service so we can have all of the flow language features translated
     * and available through the context.
     * 
     * @return {Promise<import('@lezer/language').LanguageSupport>} - The language support for the flow language to use in codemirror.
     */
    async function onInitializeLanguagePack() {
        const language = 'pt-BR'
        runtimeModulesDocumentationRef.current = []
        
        flowServiceRef.current = await FlowService.initialize(language)
        for (const moduleToRuntime of flowServiceRef.current.context.modulesToRuntime) {
            const documentation = await moduleToRuntime.moduleClass.documentation(language)
            if (![null, undefined].includes(documentation) && typeof documentation === 'object') {
                runtimeModulesDocumentationRef.current.push(documentation)
            }
        }
        return await flowLanguagePack(flowServiceRef.current.context)
    }

    async function performTest(code) {
        return await flowServiceRef.current.evaluate(code)
    }

    return {
        flowServiceRef,
        editorRef,
        runtimeModulesDocumentationRef,
        editorView,
        performTest,
        dispatchChange
    }
}