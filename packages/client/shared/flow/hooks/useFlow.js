import { useCallback, useRef } from 'react'
import { javascript } from '@codemirror/lang-javascript'
import initializeCodeEditor from '../utils/codeEditor'

export default function useFlow(dispatchCallback) {
    const codeRef = useRef()
    const editorView = useRef(null)
    // Reference: https://stackoverflow.com/a/60066291
    const editorRef = useCallback(editorNode => {
        if (editorNode !== null) {
            createNewCodeEditor(editorNode)
        } else {
            destroyExistingEditor()
        }
    }, [])

    function onDispatchTransaction() {
        return (transaction) => {
            const isEditorDefined = ![null, undefined].includes(editorView.current)
            const isDocDefined = ![null, undefined].includes(transaction?.state?.doc)
            
            if (isDocDefined && isEditorDefined) {
                const doesTransactionHaveMultipleChildren =  ![null, undefined].includes(transaction.state.doc?.children)
                const leaves = doesTransactionHaveMultipleChildren ? transaction.state.doc.children : [transaction.state.doc]
                let textArray = []
                for (let i = 0; i < leaves.length; i++) {
                    const leaf = leaves[i]
                    if (leaf.text) {
                        textArray = textArray.concat([].concat.apply([], leaf.text))
                    }
                }

                const text = textArray.join('\n')
                if (codeRef.current !== text) {
                    codeRef.current = text
                    dispatchCallback(text)
                }

                editorView.current.update([transaction])
            }
        }
    }

    function destroyExistingEditor() {
        const doesEditorExist = ![null, undefined].includes(editorView.current)
        if (doesEditorExist) {
            editorView.current.destroy()
        }

    }

    function createNewCodeEditor(editorNode) {
        destroyExistingEditor()
        editorView.current = initializeCodeEditor({
            parent: editorNode,
            code: 'console.log("Hello World!")',
            languagePack: javascript(),
            dispatchCallback: onDispatchTransaction,
        })
    }


    return {
        editorRef
    }
}