import { useCallback, useRef, useEffect } from 'react'
import initializeCodeEditor from '../utils/codeEditor'
import { EditorSelection } from '@codemirror/state'
import { snippet } from '@codemirror/autocomplete'

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
 * @param {(position: {from: number, to: number}) => void} [codeEditorOptions.onSelect=undefined] - The callback that will be called
 * whenever the selection changes in the editor.
 * @param {(text: string) => void} [codemirrorOptions.onChange=undefined] - This is the callback that will be called when
 * the code in the editor changes. Whenever the text changes in the editor we will call this function.
 * @param {(event: FocusEvent) => void} [codemirrorOptions.onBlurCallback=undefined] - This is the callback that will be called 
 * when the editor loses focus.
 * @param {(event: FocusEvent) => void} [codemirrorOptions.onFocusCallback=undefined] - This is the callback that will be called
 * when the editor gains focus.
 * @param {boolean} [isEditable=false] - Is the editor editable or is it just to show information?
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
    onSelect=undefined,
    autocompleteCallback=undefined,
    onBlurCallback=undefined,
    onFocusCallback=undefined,
    isWithActiveLine=true,
    isWithLineCounter=true,
    isEditable=true
}) {
    const onBlurCallbackRef = useRef(onBlurCallback)
    const onFocusCallbackRef = useRef(onFocusCallback)
    const autocompleteCallbackRef = useRef(autocompleteCallback)
    const onChangeRef = useRef(onChange)
    const onSelectRef = useRef(onSelect)
    const isEditableRef = useRef(isEditable)
    const isWithLineCounterRef = useRef(isWithLineCounter)
    const isWithActiveLineRef = useRef(isWithActiveLine)
    const editorNodeRef = useRef(null)

    const editorSelectionFromRef = useRef(null)
    const eventListenersRef = useRef(() => {})
    const selectionRangeRef = useRef({from: 0, to: 0})
    const codeRef = useRef(defaultCode)
    const editorViewRef = useRef(null)
    // Reference: https://stackoverflow.com/a/60066291
    const editorRef = useCallback(editorNode => {
        editorNodeRef.current = editorNode
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

    /**
     * Callback that is supposed to be called to change the text of the editor. Whenever the text changes in the state or whatever
     * this should be called with the new text.
     * 
     * @param {string} newText - the new text of the codemirror text editor.
     * @param {object} changeParams - The new text and params of the codemirror editor.
     * @param {number | undefined} [changeParams.from=undefined] - From what position you want to change the text.
     * @param {number | undefined} [changeParams.to=undefined] - To what position you want to change the text.
     * @param {boolean} [changeParams.replaceText=false] - Replace the hole text or nor?
     * @param {number | undefined} [changeParams.withCursorAt=undefined] - The position of the cursor after the change.
     * @param {boolean} [changeParams.isSnippet=false] - If this is defined and set to true, then we will not a add a new text as a snippet.
     * Snippets are part of codemirror https://github.com/codemirror/autocomplete/blob/main/src/snippet.ts#L155, with this we are able to
     * create "placeholders" where the user can define the attributes and move between them using `TAB` or `SHIFT+TAB`.
     */
    function dispatchChange(newText, { from=undefined, to=undefined, replaceText=false, withCursorAt=undefined, isSnippet=false }={}) {
        const isEditorDefined = ![null, undefined].includes(editorViewRef.current)

        if (isEditorDefined) {
            const isFromDefined = from !== undefined && typeof from === 'number'
            const isToDefined = to !== undefined && typeof to === 'number'
            const isWithCursorAtDefined = withCursorAt !== undefined && typeof withCursorAt === 'number'

            if (isSnippet) {
                const fromPosition = editorViewRef.current.state.selection.ranges.length > 0 ? editorViewRef.current.state.selection.ranges[0].from : 0
                const toPosition = editorViewRef.current.state.selection.ranges.length > 0 ? editorViewRef.current.state.selection.ranges[0].to : 0

                snippet(newText)(editorViewRef.current, {}, fromPosition, toPosition)
            } else if (isWithCursorAtDefined) {
                const state = editorViewRef.current.state
                const text = state.toText(newText)
                editorViewRef.current.dispatch(
                    state.changeByRange(range => ({
                        changes: {
                            from: from !== undefined ? from : range.from, 
                            to: to !== undefined ? to : range.to, 
                            insert: text
                        },
                        range: EditorSelection.cursor(withCursorAt)
                    }))
                )
            } else if (replaceText === true) {
                const state = editorViewRef.current.state
                editorViewRef.current.dispatch({
                    changes: {
                        from: 0, 
                        to: state.doc.length, 
                        insert: newText
                    }
                })
            } else if (isFromDefined && isToDefined) {
                editorViewRef.current.dispatch({
                    changes: {
                        from: from, 
                        to: to, 
                        insert: newText
                    }
                })
            } else if (isFromDefined && !isToDefined) {
                editorViewRef.current.dispatch({
                    changes: {
                        from: from, 
                        insert: newText
                    }
                })
            } else if (!isFromDefined && !isToDefined) {
                editorViewRef.current.dispatch(editorViewRef.current.state.replaceSelection(newText))
            }
        }
    }

    /**
     * Function that is called when the text changes, to trigger our custom autocomplete behaviour in the text
     * editor.
     * 
     * By default codemirror offers an autocomplete: https://codemirror.net/6/examples/autocompletion/
     * But sometimes we want something that is more nicely formated and less "developerly" for users to use.
     * 
     * @param {import('codemirror/state').EditorState} state - Retrieves the editor state of the codemirror editor
     * and that we use in our autocomplete callback.
     */
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
                
                const doesExistSelectionRange = Array.isArray(transaction?.state?.selection?.ranges) && transaction.state.selection.ranges.length > 0
                const isOnSelectDefined = typeof onSelectRef.current === 'function'
                if (doesExistSelectionRange && isOnSelectDefined) {
                    const positionFrom = transaction.state.selection.ranges[0].from
                    const positionTo = transaction.state.selection.ranges[0].to
                    
                    if (positionFrom !== selectionRangeRef.current.from || positionTo !== selectionRangeRef.current.to) {
                        onSelectRef.current({ from: positionFrom, to: positionTo })
                    }
                }

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

    /**
     * Adds or removes listeners from the DOM. The API is simple: 
     * 1- When we first call the functions we add the listeners to the DOM and return a function
     * 2 - When we call the returned function we remove the listeners from the DOM.
     */
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
            dispatchCallback: onDispatchTransaction,
            editable: isEditableRef.current,
            removeLineCounter: !isWithLineCounterRef.current,
            isWithActiveLine: isWithActiveLineRef.current,
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
    useEffect(() => { onSelectRef.current = onSelect }, [onSelect])
    useEffect(() => { autocompleteCallbackRef.current = autocompleteCallback }, [autocompleteCallback])
    useEffect(() => { 
        const isIsEditableDifferentFromCurrentIsEditable = isEditable !== isEditableRef.current
        if (isIsEditableDifferentFromCurrentIsEditable) {
            createNewCodeEditor(editorNodeRef.current)
        }
    }, [isEditable])
    useEffect(() => {
        const isIsWithLineCounterDifferentFromCurrentIsWithLineCounter = isWithLineCounter !== isWithLineCounterRef.current
        if (isIsWithLineCounterDifferentFromCurrentIsWithLineCounter) {
            createNewCodeEditor(editorNodeRef.current)
        }
    }, [isWithLineCounter])
    useEffect(() => {
        const isIsWithActiveLineDifferentFromCurrentIsWithActiveLine = isWithActiveLine !== isWithActiveLineRef.current
        if (isIsWithActiveLineDifferentFromCurrentIsWithActiveLine) {
            createNewCodeEditor(editorNodeRef.current)
        }
    }, [isWithActiveLine])

    return {
        editorRef,
        editorViewRef,
        dispatchChange,
        forceFocus,
        forceBlur
    }
}