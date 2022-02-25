import { useEffect, useState, useRef, Fragment } from 'react'
import { lezer } from '@codemirror/lang-lezer'
import { snippetCompletion } from "@codemirror/autocomplete"
import { buildParser } from '@lezer/generator'
import {
    LRLanguage, LanguageSupport,
    continuedIndent, indentNodeProp,
    foldNodeProp, foldInside, syntaxTree
} from "@codemirror/language"
import { styleTags, tags as t } from "@codemirror/highlight"
import { useCodemirror, useFlow } from '../../../shared/flow'
import flowLanguageParser from '../../../shared/flow/utils/flowLanguage/lezerParser'
import * as Styled from './styles'

export default function LezerEditorPage(props) {
    const isInDevelopment = process.env.NODE_ENV === 'development'

    if (isInDevelopment === true) {
        const [flowLezer, setFlowLezer] = useState(flowLanguageParser)
        const [flowCode, setFlowCode] = useState('if 1 + 1 == 2 do 2 end')
        const { visualize, Color, defaultTheme } = require('@colin_t/lezer-tree-visualizer')     
        const { editorRef } = useCodemirror({ 
            languagePack: lezer(), 
            defaultCode: flowLezer, 
            dispatchCallback: onChangeFlowLezer 
        })
        const { editorRef: flowEditorRef, editorView: flowEditorView, dispatchChange } = useFlow({ 
            dispatchCallback: onChangeFlowCode, 
            code: flowCode,
            getLanguagePack: initializeLanguagePack
        })
        
        /**
         * Initializes the flow language parser so we can edit here directly, we will be able to edit how the code is styled and parsed
         * from here directly.
         * 
         * This gives us a simple and smooth debug and development experience when managing flow in the front-end.
         * 
         * @returns {LanguageSupport} - The language support for the flow language.
         */
        function initializeLanguagePack() {
            const parser = buildParser(flowLezer)
            const styles = {
                ["and or is in not"]: t.operatorKeyword,
                ["do end if else try catch return raise"]: t.controlKeyword,
                ["function module"]: t.definitionKeyword,
                Boolean: t.bool,
                String: t.string,
                Number: t.number,
                Variable: t.variableName,
                VariableDefinition: t.definition(t.variableName),
                "AddOperators ProductOperators": t.arithmeticOperator,
                "BooleanOperators": t.compareOperator,
                LineComment: t.lineComment,
                DocumentationBlockComment: t.blockComment,
                ["None"]: t.null,
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
                            IfExpression: continuedIndent({except: /^\s*(end|else\b)/}),
                            ElseExpression: continuedIndent({except: /^\s*(end|else\b)/}),
                            TryExpression: continuedIndent({except: /^\s*(end|catch\b)/}),
                            CatchExpression: continuedIndent({except: /^\s*(end\b)/}),
                            List: continuedIndent({except: /^\s*(\]\b)/}),
                            Dict: continuedIndent({except: /^\s*(\}\b)/}),
                            FunctionDefinitionExpression: continuedIndent({ except: /^\s*(end\b)/})
                        }),
                        foldNodeProp.add({
                            "ElseExpression IfExpression FunctionDefinitionExpression": foldInside,
                        }),
                        styleTags(styles)
                    ]
                }),
                languageData: {
                    closeBrackets: { brackets: ["(", "[", "{", "do", "'", '"', '`'] },
                    commentTokens: {line: "//", block: {open: "/*", close: "*/"}},
                    indentOnInput: /^\s*(do|end|else|catch)$/,
                }
            })

            function autocomplete(context) {
                const nodeBefore = syntaxTree(context.state).resolveInner(context.pos, -1)
                if (nodeBefore.parent?.name === 'Attribute') {
                    let variable = nodeBefore.parent.getChild('Primary')
                    const doesVariableExists = ![null, undefined].includes(variable)
                    if (doesVariableExists) {
                        const variableName = context.state.sliceDoc(variable.from, variable.to)
                        const slicedVariableNameByAttributes = variableName.slice('.')
                        const variableNameToFilterTo = slicedVariableNameByAttributes.length > 0 ? 
                            slicedVariableNameByAttributes[slicedVariableNameByAttributes.length - 1] : variableName
                        return {
                            from: variable.to + 1,
                            options: [
                                snippetCompletion('get("${url}")', { label: 'get', detail: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vulputate facilisis metus non euismod. Mauris euismod eget ex eu venenatis. Aenean hendrerit consequat posuere. Phasellus elementum fringilla felis, nec blandit arcu molestie vitae. Nam ut lacus ut orci mattis luctus. Sed mattis sapien consequat augue ultrices ', type: "function" }),
                                {label: "post", type: "function", info: "(World)"},
                                {label: "request", type: "function", info: "(World)"}
                            ],
                            span: /^[\w$]*$/
                        }
                    }
                } else if (nodeBefore.name === 'Variable') {
                    return {
                        from: nodeBefore.from, 
                        options: [
                            {label: "Boolean", type: "interface", info: "(World)"},
                            {label: "HTTP", type: "interface", info: "(World)"},
                            {label: "magic", type: "text", apply: "⠁⭒*.✩.*⭒⠁", detail: "macro"}
                        ],
                        filter: false
                    }
                    //return completeProperties(nodeBefore.from, window)
                } else if (context.explicit && !dontCompleteIn.includes(nodeBefore.name)) {
                   //return completeProperties(context.pos, window)
                }
                return null
            }
            return new LanguageSupport(flowLanguage, flowLanguage.data.of({
                autocomplete: autocomplete
            }))
        }

        /**
         * This will test the Flow Language Lezer parser and visualize the result to see if it's kinda matching what we do expect
         * from the parser of the language. 
         * 
         * This information will be available on the console of the browser, so you need to open devtools in your favorite browser.
         */
        async function onTestFlowLezer() {
            const parser = buildParser(flowLezer)
            const tree = parser.parse(flowCode)
            visualize(tree.cursor(), flowCode, { 
                theme: {
                    ...defaultTheme,
                    name: Color.DarkGreen,
                    source: Color.DarkRed,
                }    
            })
        }
            
        function onChangeFlowCode(newFlowCode) {
            setFlowCode(newFlowCode)
        }

        function onChangeFlowLezer(newFlowLezer) {
            flowEditorView.current
            setFlowLezer(newFlowLezer)
        }
        
        return (
            <Styled.Container>
                <Styled.Button
                onClick={() => onTestFlowLezer()}
                >
                    {'Test Lezer'}
                </Styled.Button>
                <Styled.Label>
                    {'Lezer Editor'}
                </Styled.Label>
                <div ref={editorRef}/>
                <Styled.Label>
                    {'Flow Editor'}
                </Styled.Label>
                <div ref={flowEditorRef}/>
                <Styled.Button
                onClick={() => dispatchChange('heeeey')}
                >
                    {'Test Lezer'}
                </Styled.Button>
            </Styled.Container>
        )
    } else {
        return (
            <p>
                {'Sorry, this page is for development only.'}
            </p>
        )
    }
}