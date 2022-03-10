import { 
    EditorView,
    keymap, 
    highlightSpecialChars, 
    drawSelection, 
    highlightActiveLine, 
    dropCursor 
} from "@codemirror/view"
import { Extension, EditorState } from "@codemirror/state"
import { history, historyKeymap } from "@codemirror/history"
import { foldGutter, foldKeymap } from "@codemirror/fold"
import { indentOnInput } from "@codemirror/language"
import { lineNumbers, highlightActiveLineGutter } from "@codemirror/gutter"
import { defaultKeymap } from "@codemirror/commands"
import { bracketMatching } from "@codemirror/matchbrackets"
import { closeBrackets, closeBracketsKeymap } from "@codemirror/closebrackets"
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search"
import { autocompletion, completionKeymap } from "@codemirror/autocomplete"
import { commentKeymap } from "@codemirror/comment"
import { rectangularSelection } from "@codemirror/rectangular-selection"
import { defaultHighlightStyle } from "@codemirror/highlight"
import { lintKeymap } from "@codemirror/lint"
import { HighlightStyle, tags as t } from '@codemirror/highlight'
import { indentWithTab } from '@codemirror/commands'

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

const initializeCodeEditor = ({
    parent, code, languagePack, editable=true, dispatchCallback=null, 
    removeLineCounter=true, isWithActiveLine=true,
} = {}) => {

    // This was completly taken from here: https://github.com/codemirror/basic-setup/blob/main/src/basic-setup.ts#L53
    // We add our modifications as we wish.
    let extensions = [
        languagePack, 
        //basicSetup,
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        history(),
        drawSelection(),
        dropCursor(),
        EditorState.allowMultipleSelections.of(true),
        indentOnInput(),
        defaultHighlightStyle.fallback,
        bracketMatching(),
        closeBrackets(),
        autocompletion(),
        rectangularSelection(),
        highlightSelectionMatches(),
        keymap.of([
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...searchKeymap,
            ...historyKeymap,
            ...foldKeymap,
            ...commentKeymap,
            ...completionKeymap,
            ...lintKeymap,
            indentWithTab
        ])
    ]

    if (removeLineCounter === false) extensions = extensions.concat(foldGutter(), lineNumbers())
    if (isWithActiveLine === true) extensions = extensions.concat(highlightActiveLine())
    
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