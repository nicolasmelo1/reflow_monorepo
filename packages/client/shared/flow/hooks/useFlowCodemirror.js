import { useRef } from 'react'
import flowLanguageParser from '../utils/flowLanguage'
import useCodemirror from './useCodemirror'
import {
    LRLanguage, LanguageSupport,
    continuedIndent, indentNodeProp,
    foldNodeProp, foldInside, syntaxTree
} from "@codemirror/language"
import { styleTags, tags as t } from "@codemirror/highlight"

/**
 * Hook created to be tightly coupled with the codemirror editor on one side, and Flow on the other.
 * 
 * It provides all of the necessary functionality that exposes codemirror to flow. We use this because
 * we can have a good separation of concerns here, and we will also be able to split the code in different 
 * environments like mobile, desktop, and web. 
 * 
 * In simple terms: it takes the data recieved from the codemirror editor, understand, and transform it to
 * a way it's useful for flow. But it does NOT interact with flow itself.
 */
export default function useFlowCodemirror() {
    const { editorRef, editorView, dispatchChange } = useCodemirror({
        languagePack: getLanguagePack === undefined ? onInitializeLanguagePack : getLanguagePack, 
        defaultCode: code,
        dispatchCallback,
        autocompleteCallback: autocomplete,
        onBlurCallback: onBlur,
        onFocusCallback: onFocus
    })

    /**
     * Function responsible for traversing the LAZER (codemirror) AST of the Flow language. You can see and inspect
     * the tree structure using a tool like https://github.com/ColinTimBarndt/lezer-tree-visualizer so you can see it.
     * 
     * @param {import('@lezer/common').BufferNode | import('@lezer/common').Tree | null} node - You can check here
     * for reference of the classes https://github.com/lezer-parser/common/blob/main/src/tree.ts 
     * @param {Array<string>} nodeTypes - The list of node types to see if it's up in the tree structure. These are one of the
     * nodes defined in the `lezerParser.js` file. It matches the first node that it finds in the list.
     * 
     * @returns {{name: string, node: import('@lezer/common').BufferNode | undefined }} - Returns an object with found 
     * the name of the node as well as the node itself. If the node is not found, it will return undefined in the node 
     * and an empty string.
     */
    function traverseNodesFromBottomToTopOfTheTree(node, nodeTypes) {
        if (node !== null && nodeTypes.includes(node.name)) {
            return {
                name: node.name,
                node: node
            }
        } else if (node === null || node.parent === undefined) {
            return {
                name: '',
                node: undefined
            }
        } else return traverseNodesFromBottomToTopOfTheTree(node.parent, nodeTypes)
    }

    /**
     * Function used for retrieving the node name of the parameter that is being edited. For example:
     * on the function:
     * ```
     * function sum(x, y) do
     *      x + y
     * end
     * ```
     * 
     * if the user types `sum(1, |)` (while the cursor is on the `|`), the function will return 
     * ```
     * {
     *    currentParameterName: '',
     *    currentParameterIndex: 1
     * }
     * ```
     * This means that the user is editing the parameter `y`, so we should highlight the `y` in the 
     * editor.
     * 
     * if the user types `sum(y= |)` (while the cursor is on the `|`), the function will return 
     * ```
     * {
     *   currentParameterName: 'y',
     *   currentParameterIndex: 0
     * }
     * ```
     * 
     * This means that, although the variable `y` exists in position 1 in our function, it is actually
     * being inserted in position 0.
     * 
     * @param {string} openBracket - The bracket that is used to open the parameter or module.
     * For flow it can be either `(` for function calls or `{` for module creation.
     * @param {string} closeBracket - The bracket that is used to close the parameter or module.
     * For flow it can be either `)` for function calls or `}` for module creation.
     * @param {import('@lezer/common').BufferNode} node - The FunctionCall or Struct nodes to check the parameter
     * position for. You can check here for reference of this class
     * https://github.com/lezer-parser/common/blob/main/src/tree.ts 
     * 
     * @returns {{currentParameterName: string, currentParameterIndex: number}} - Returns an object 
     * with the name of of the parameter and the index of the parameter that is being edited.
     */
    function autocompleteGetCurrentParameterIndexAndParameterName(openBracket, closeBracket, node) {
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

    /**
     * This functions was coded mostly by changing and editing the `Completing by syntax` from this
     * example documentation: https://codemirror.net/6/examples/autocompletion/
     * 
     * This function is responsible for retrieving the autocomplete suggestions for the flow language.
     * It does not return anything, instead it just calls a specific callback functions passed that will send
     * the data. This calculates 2 things, and both thing are optional and depends only if the callbacks 
     * were passed.
     * 
     * 1 - It calculates which parameter is being edited in the function call or struct creation with this
     * we can nicely highlight this information in the editor on the native or web side outside of the editor
     * itself.
     * 2 - It does not calculate the autocomplete suggestions, but instead it sends for the callback functions
     * the data needed to calculate the autocomplete suggestions based on the variable name that is being typed.
     * 
     * For 1 to work, `onAutocompleteFunctionOrModule` parameter should be a function.
     * For 2 to work, `onAutoComplete` parameter should be a function.
     * 
     * @param {import('@codemirror/state').EditorState} state - The codemirror editor state.
     */
    function autocomplete(state) {
        const fromPosition = state.selection.ranges[0].from
        //
        const currentNode = syntaxTree(state).resolveInner(fromPosition, -1)

        if (onAutocompleteFunctionOrModule !== undefined) {
            const { name: nodeName, node: functionOrModuleNode } = traverseNodesFromBottomToTopOfTheTree(
                currentNode, ['FunctionCall', 'Struct']
            )

            if (nodeName === 'FunctionCall') {
                const currentParameterIndexAndName = autocompleteGetCurrentParameterIndexAndParameterName(
                    '(', ')', functionOrModuleNode
                )
                const firstChild = functionOrModuleNode.firstChild
                
                let moduleName = null
                const {node: attributeNode} = traverseNodesFromBottomToTopOfTheTree(
                    currentNode, ['Attribute']
                )
                if (attributeNode !== undefined) {
                    moduleName = state.sliceDoc(attributeNode.firstChild.from, attributeNode.firstChild.to)
                }
                const functionName = state.sliceDoc(firstChild.from, firstChild.to)

                onAutocompleteFunctionOrModule({
                    moduleName: moduleName,
                    name: functionName,
                    ...currentParameterIndexAndName,
                })
            } else if (nodeName === 'Struct') {
                const currentParameterIndexAndName = autocompleteGetCurrentParameterIndexAndParameterName(
                    '{', '}', functionOrModuleNode
                )
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
            const { node: attributeNode } = traverseNodesFromBottomToTopOfTheTree(
                currentNode, ['Attribute']
            )
            const attributeName = attributeNode !== undefined ? 
                state.sliceDoc(attributeNode.firstChild.from, attributeNode.firstChild.to) : ''
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
     * @returns {LanguageSupport} - The language support for the flow language.
     */
    async function flowLanguagePack() {
        const flowContext = await Promise.resolve(getFlowContext())
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
}