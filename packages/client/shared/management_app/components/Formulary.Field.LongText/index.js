import { APP } from '../../../conf'
import { useRef, useEffect, useState } from 'react'
import Layout from './layouts'

export default function FormularyFieldLongText(props) {
    const textAreaRef = useRef()

    /**
     * / * WEB ONLY * /
     * 
     * This will make the textarea automatically grow when we write a value inside of it, so the user doesn't need to automatically set
     * the height of the input or scroll through the hole input to se the contents.
     * 
     * Reference: https://www.geeksforgeeks.org/how-to-create-auto-resize-textarea-using-javascript-jquery/
     */
    function webOnInputGrowInput() {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = 'auto'
            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px'
        }
    }

    /**
     * When the component is automatically created. We automatically define the height of the input. Also since that sometimes we might
     * have the values defined in the state, we need to autoGrow the textArea on the first render. For example:
     * without calling `webOnInputGrowInput` function on the first render and recieving the following text:
     * `
     * Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
     * Donec ultricies turpis non rutrum ornare. 
     * Suspendisse et ligula ac enim tincidunt tincidunt vitae rutrum lacus. 
     * Proin feugiat, enim dapibus tincidunt volutpat, velit lacus sagittis sapien
     * `
     * we would have to scroll on the text area on the first render, because the listener will only be called when we input something in the textArea,
     * so this means that with this text the input will not auto grow, so to fix this issue we need to call it first.
     * 
     * Besides that you can find more information in the referencei in the `webOnInputGrowInput` function.
     */
    useEffect(() => {
        if (APP === 'web' && textAreaRef.current) {
            webOnInputGrowInput()
            textAreaRef.current.addEventListener('input', webOnInputGrowInput, false)
        }
        
        return () => {
            if (APP === 'web' && textAreaRef.current) textAreaRef.current.removeEventListener('input', webOnInputGrowInput)
        }
    }, [])

    return (
        <Layout
        textAreaRef={textAreaRef}
        types={props.types}
        field={props.field}
        />
    )
}
