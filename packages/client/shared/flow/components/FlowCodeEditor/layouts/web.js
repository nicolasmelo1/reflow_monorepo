import { useState, useEffect } from 'react'

import { useFlowCodemirror } from "../../../hooks"

export default function FlowWebCodeEditor({functionsRef, ...props}) {
    const { 
        editorRef, dispatchChange, forceFocus, forceBlur
    } = useFlowCodemirror(props)
    
    useEffect(() => {
        functionsRef.current = {
            dispatchChange,
            forceFocus,
            forceBlur
        }
    }, [dispatchChange, forceFocus, forceBlur])
    
    return <div ref={editorRef}/>
}