import { basicSetup, EditorState, EditorView } from '@codemirror/basic-setup'
import { HighlightStyle, tags as t } from '@codemirror/highlight'
import { indentWithTab } from '@codemirror/commands'
import { keymap } from '@codemirror/view'


const getDefaultTheming = ({removeLineCounter=false} = {}) => {
    const editorDefaultTheme = {
        "&": {
            color: "white",
            backgroundColor: "#20253F",
            borderRadius: '5px'
        },
        ".cm-selectionMatch": {
            backgroundColor: "#bfbfbf20"
        },
        ".cm-content": {
            caretColor: "#0e9"
        },
        "&.cm-focused": {
            outline: 'none !important',
        },
        "&.cm-focused .cm-cursor": {
            borderLeftColor: "#0e9"
        },
        "&.cm-focused .cm-selectionBackground, ::selection": {
            outline: 'none',
            backgroundColor: "#0dbf7e20"
        },
        '.cm-activeLine': {
            backgroundColor: "transparent"
        },
        '.cm-gutters': {
            borderRadius: '5px'
        }
    }

    if (removeLineCounter === true) {
        editorDefaultTheme['.cm-gutters'] = {
            display: 'none'
        }
    }
    return EditorView.theme(editorDefaultTheme, {dark: true})
}


const syntaxHighlightTheme = HighlightStyle.define([
    {
        tag: t.blockComment,
        color: '#bfbfbf'
    },
    {
        tag: t.lineComment,
        color: '#bfbfbf'
    },
    {
        tag: t.propertyName,
        color: '#ff7c7c'
    },
    {
        tag: t.keyword,
        color: '#0dbf7e'
    },
    {
        tag: t.controlKeyword,
        color: '#0dbf7e'
    },
    {
        tag: t.operatorKeyword,
        color: '#0dbf7e'
    },
    {
        tag: t.variableName,
        color: 'cyan'
    },
    {
        tag: t.attributeValue,
        color: '#FEDD00'
    },
    {
        tag: t.className,
        color: '#FEDD00'
    },
    {
        tag: t.content,
        color: '#FEDD00'
    },
    {
        tag: t.tagName,
        color: '#FEDD00'
    },
    {
        tag: t.modifier,
        color: '#0dbf7e'
    },
    {
        tag: t.controlKeyword,
        color: '#0dbf7e'
    },
    {
        tag: t.definitionKeyword,
        color: '#0dbf7e'
    },
    {
        tag: t.arithmeticOperator,
        color: 'cyan'
    },
    {
        tag: t.logicOperator,
        color: 'cyan'
    },
    {
        tag: t.bitwiseOperator,
        color: 'cyan'
    },
    {
        tag: t.compareOperator,
        color: 'cyan'
    },
    {
        tag: t.regexp,
        color: 'cyan'
    },
    {
        tag: t.definitionOperator,
        color: 'cyan'
    },
    {
        tag: t.punctuation,
        color: '#fff'
    },
    {
        tag: t.null,
        color: 'orange'
    },
    {
        tag: t.bool,
        color: '#eaa0ff'
    },
    {
        tag: t.string,
        color: '#bbffaf'
    },
    {
        tag: t.number,
        color: '#afb0ff'
    },
    {
        tag: t.labelName,
        color: 'red'
    }
])

const initializeCodeEditor = ({parent, code, languagePack, editable=true, dispatchCallback=null, removeLineCounter=false} = {}) => {
    let extensions = [
        languagePack, 
        basicSetup,
        keymap.of([
            indentWithTab
        ]),
        //[getDefaultTheming({removeLineCounter: removeLineCounter}), syntaxHighlightTheme]
    ]
    

    if (editable === false) {
        extensions = [...extensions, EditorView.editable.of(false)]
    }

    const state = {
        doc: code, 
        extensions: extensions,
    }

    let viewOptions = {
        state: EditorState.create(state),
        parent: parent
    }

    if (dispatchCallback) {
        viewOptions.dispatch = dispatchCallback()
    }

    const editor = new EditorView(viewOptions)

    return editor
}


export default initializeCodeEditor