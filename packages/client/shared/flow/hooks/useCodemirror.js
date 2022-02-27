import { useCallback, useRef, useEffect } from 'react'
import initializeCodeEditor from '../utils/codeEditor'

/**
 * Hook created to be able to interact with codemirror. Codemirror 6 is an editor from Marijn.
 * Here you can find the docs for codemirror 6: 
 * https://codemirror.net/6/
 * 
 * At the current time, codemirror 5 is still active, notice that the format of the docs change 
 * on this version: https://codemirror.net/ If you see this monkey on the side, then it's the wrong
 * documentation.
 * 
 * It can get kinda troublesome to search stuff on google because of this confusion, so try to always 
 * certify that it's being refered as 'codemirror 6' or 'codemirror next'
 *
 * A great place where you can find reference and information is their discussions blog: 
 * https://discuss.codemirror.net/ when it's something from the new codemirror, it is marked as /next
 * on it. You can also find lot's of resources for lezer marked with '/lezer'
 * Last but not least, for specific APIs you might want to read the source code of the projects where this
 * api come from. The source code is really well documented and it's a good place to find reference to what 
 * you are using.
 * 
 * @param {object} codemirrorOptions - The options for codemirror hook so you can set up and override most
 * of the needed stuff.
 * @param {function | import('@codemirror/language').LanguageSupport} codemirrorOptions.mode - The mode for the editor, 
 * this is the language you want to use. You can pass either a function or a language support object from codemirror.
 * The function also can be async, so there is no problem when loading the language.
 * @param {string} [codemirrorOptions.defaultCode=''] - This is the code that will be loaded in the editor when the
 * editor is created and rendered. Be careful with this, you need to keep the state always updated. If we for some
 * reason destruct and recreate the editor, the code in it will be lost, so be sure to save it in a react state.
 * @param {(text) => void} [codemirrorOptions.onChange=undefined] - This is the callback that will be called when
 * the code in the editor changes. Whenever the text changes in the editor we will call this function.
 * @param {(FocusEvent) => void} [codemirrorOptions.onBlurCallback=undefined] - This is the callback that will be called 
 * when the editor loses focus.
 * @param {(FocusEvent) => void} [codemirrorOptions.onFocusCallback=undefined] - This is the callback that will be called
 * when the editor gains focus.
 * 
 * @returns {{
 *      editorRef: {current: any},
 *      editorViewRef: @import('@codemirror/view').EditorView,
 *      dispatchChange: (newText, { from=undefined, to=undefined, replaceText=false }={}) => void,
 *      forceBlur: () => void,
 *      forceFocus: () => void
 * }} 
 */
export default function useCodemirror({
    languagePack, defaultCode='',
    onChange=undefined,
    autocompleteCallback=undefined,
    onBlurCallback=undefined,
    onFocusCallback=undefined
}) {
    const onBlurCallbackRef = useRef(onBlurCallback)
    const onFocusCallbackRef = useRef(onFocusCallback)
    const autocompleteCallbackRef = useRef(autocompleteCallback)
    const onChangeRef = useRef(onChange)
    
    const editorSelectionFromRef = useRef(null)
    const eventListenersRef = useRef(() => {})
    const codeRef = useRef(defaultCode)
    const editorViewRef = useRef(null)
    // Reference: https://stackoverflow.com/a/60066291
    const editorRef = useCallback(editorNode => {
        function initializeEditor() {
            if (editorNode !== null) {
                createNewCodeEditor(editorNode)
            } else {
                destroyExistingEditor()
            }
        }
        if (editorNode !== null) {
            initializeEditor()
        }
    }, [])

    function dispatchChange(newText, { from=undefined, to=undefined, replaceText=false }={}) {
        const isEditorDefined = ![null, undefined].includes(editorViewRef.current)

        if (isEditorDefined) {
            const isFromDefined = from !== undefined && typeof from === 'number'
            const isToDefined = to !== undefined && typeof to === 'number'

            if (isFromDefined && isToDefined) {
                editorViewRef.current.dispatch({
                    changes: {from: from, to: to, insert: newText}
                })
            } else if (isFromDefined && !isToDefined) {
                editorViewRef.current.dispatch({
                    changes: {from: from, insert: newText}
                })
            } else if (!isFromDefined && !isToDefined) {
                const fromPosition = editorViewRef.current.state.selection.ranges.length > 0 ? editorViewRef.current.state.selection.ranges[0].from : 0

                editorViewRef.current.dispatch(editorViewRef.current.state.replaceSelection(newText))
            }
        }
    }

    function autocomplete(state) {
        const isAutocompleteCallbackDefined = ![null, undefined].includes(autocompleteCallbackRef.current) && 
            typeof autocompleteCallbackRef.current === 'function'
        if (isAutocompleteCallbackDefined) autocompleteCallbackRef.current(state)
    }

    /**
     * This function will dispatch the changes to a defined `onChangeRef` function. So every time the user writes something in the editor, we will call this 
     * callback function.
     * 
     * It was done mostly by trial and error. But you can read in the examples here: https://codemirror.net/6/examples/ or the documentation.
     * 
     * @returns {(transaction) => void} - Returns a function that will dispatch the changes to the `onChangeRef` function and also update the state of the editor.
     */
    function onDispatchTransaction() {
        return (transaction) => {
            const isEditorDefined = ![null, undefined].includes(editorViewRef.current)
            const isDocDefined = ![null, undefined].includes(transaction?.state?.doc)

            if (isDocDefined && isEditorDefined) {
                const doesTransactionHaveMultipleChildren =  ![null, undefined].includes(transaction.state.doc?.children)
                const leaves = doesTransactionHaveMultipleChildren ? transaction.state.doc.children : [transaction.state.doc]
                // The editor can span multiple lines, and this lines will be called TextLeaf. This textLeaf will contain 15 lines only. For every
                // 15 lines a new TextLeaf will be created, so we need to loop through all of them to retrieve the hole content.
                let textArray = []
                for (let i = 0; i < leaves.length; i++) {
                    const leaf = leaves[i]
                    if (leaf.text) {
                        textArray = textArray.concat([].concat.apply([], leaf.text))
                    }
                }
                // Each children will be a line, so it's safe to join them by a new line.
                const text = textArray.join('\n')
                
                if (editorSelectionFromRef.current !== null && editorSelectionFromRef.current !== transaction.state.selection.ranges[0].from) {
                    autocomplete(transaction.state)
                }

                if (codeRef.current !== text) {
                    codeRef.current = text
                    if (onChangeRef.current !== undefined) {
                        onChangeRef.current(text)
                    }
                }

                const hasAnyRangeSelected = transaction?.state?.selection?.ranges !== undefined && transaction?.state?.selection?.ranges.length > 0
                if (hasAnyRangeSelected) editorSelectionFromRef.current = transaction.state.selection.ranges[0].from
    
                editorViewRef.current.update([transaction])
            }
        }
    }

    /**
     * Destroys an existing editor if it exists.
     */
    function destroyExistingEditor() {
        eventListenersRef.current()
        const doesEditorExist = ![null, undefined].includes(editorViewRef.current)
        if (doesEditorExist) {
            editorViewRef.current.destroy()
        }
    }

    function forceFocus() { 
        if (editorViewRef.current) editorViewRef.current.contentDOM.focus() 
    }

    function forceBlur() { 
        if (editorViewRef.current) editorViewRef.current.contentDOM.blur()
    }

    function addAndRemoveEventListeners() {
        function onBlur(e){
            const isOnBlurCallbackDefined = onBlurCallbackRef.current !== undefined && 
                typeof onBlurCallbackRef.current === 'function'
            if (isOnBlurCallbackDefined) onBlurCallbackRef.current()
        }

        function onFocus(e) {
            const isOnFocusCallbackDefined = onFocusCallbackRef.current !== undefined && 
                typeof onFocusCallbackRef.current === 'function'
            if (isOnFocusCallbackDefined) {
                onFocusCallbackRef.current()
                autocomplete(editorViewRef.current.state)
            }
        }

        editorViewRef.current.contentDOM.addEventListener('blur', onBlur)
        editorViewRef.current.contentDOM.addEventListener('focus', onFocus)
        return () => {
            editorViewRef.current.contentDOM.removeEventListener('blur', onBlur)
            editorViewRef.current.contentDOM.removeEventListener('focus', onFocus)
        }
    }

    /**
     * Creates a new CodeMirror editor instance in a specific DOM node.
     */
    async function createNewCodeEditor(editorNode) {
        destroyExistingEditor()

        const codeEditorOptions = {
            parent: editorNode,
            code: codeRef.current,
            languagePack: null,
            dispatchCallback: onDispatchTransaction
        }

        const isLanguagePackAFunction = typeof languagePack === 'function'
        let editorLanguagePack = languagePack
        if (isLanguagePackAFunction) editorLanguagePack = await Promise.resolve(languagePack())

        codeEditorOptions.languagePack = editorLanguagePack
        editorViewRef.current = initializeCodeEditor(codeEditorOptions)
        eventListenersRef.current = addAndRemoveEventListeners()
    }

    useEffect(() => { onBlurCallbackRef.current = onBlurCallback }, [onBlurCallback])
    useEffect(() => { onFocusCallbackRef.current = onFocusCallback }, [onFocusCallback])
    useEffect(() => { onChangeRef.current = onChange }, [onChange])
    useEffect(() => { autocompleteCallbackRef.current = autocompleteCallback }, [autocompleteCallback])

    return {
        editorRef,
        editorViewRef,
        dispatchChange,
        forceFocus,
        forceBlur
    }
}