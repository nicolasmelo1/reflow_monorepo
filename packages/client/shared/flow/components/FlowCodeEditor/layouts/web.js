import { useEffect } from 'react'
import { useFlowCodemirror } from "../../../hooks"

/**
 * This will load the useFlowCodemirror in the component passing all of the props recieved from
 * the parent component.
 * 
 * The useFlowCodemirror returns actions that we can use in the parent component. Those actions become available
 * if you send a `functionsRef`. We will append those actions in this ref and then in the parent component
 * you are able to call for example:
 * ```
 * functionsRef.current.dispatchChange('To Add on Codemirror editor')
 * ```
 */
export default function FlowWebCodeEditor({functionsRef, ...props} = {}) {
    const { 
        editorRef, dispatchChange, forceFocus, forceBlur
    } = useFlowCodemirror(props)
    
    useEffect(() => {
        if (functionsRef !== undefined) {
            functionsRef.current = {
                dispatchChange,
                forceFocus,
                forceBlur
            }
        }
    }, [dispatchChange, forceFocus, forceBlur])
    
    return <div ref={editorRef}/>
}