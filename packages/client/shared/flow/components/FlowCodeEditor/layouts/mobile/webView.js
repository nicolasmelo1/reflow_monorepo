import React, { useEffect, useState, useRef } from 'react'
import useFlowCodemirror from '../../../../hooks/useFlowCodemirror'
import { generateUUID } from '../../../../../../../shared/utils'
// This needs to be solved by webpack or metro alias configuration, we can't use dynamicImport for that usecase 
// because it will load specific libraries for the web and not for react-native.
import {
    webViewRender,
    emit,
    useNativeMessage,
} from "react-native-react-bridge/lib/web"

/*
let webViewRender = dynamicImport('react-native-react-bridge/lib/web', 'webViewRender')
webViewRender = webViewRender !== undefined && typeof webViewRender === 'function' ? webViewRender : () => {}
console.log(webViewRender)
const useNativeMessage = dynamicImport('react-native-react-bridge/lib/web', 'useNativeMessage')
const emit = dynamicImport('react-native-react-bridge/lib/web', 'emit')*/

/**
 * This is kinda complicated, but it's necessary in order to make it work.
 * 
 * When we want to call any of the callbacks that we send to useFlowCodemirror, we need to return a Promise
 * and append the resolve of this promise to a global variable. Whenever we recieve a new message with the
 * result of this pending promise, we resolve the pending promise by calling the `resolve` function that
 * we attached to the global variable.
 * 
 * It might take some time to load the editor.
 */
function RootCodeEditor() {
    const pendingFunctionEvaluationsRef = useRef({})
    const [isLoaded, setIsLoaded] = useState(false)
    const [props, setProps] = useState({})
    const { editorRef, dispatchChange, forceFocus, forceBlur } = useFlowCodemirror(props)
    
    function funcHandler(key) {
        return (...args) => new Promise((resolve, reject) => {
            const functionCallId = generateUUID()
            pendingFunctionEvaluationsRef.current[functionCallId] = {
                toResolve: undefined,
                toReject: undefined
            }
            pendingFunctionEvaluationsRef.current[functionCallId].toResolve = resolve
            pendingFunctionEvaluationsRef.current[functionCallId].toReject = reject

            emit({ 
                type: key, 
                data: {
                    functionCallId: functionCallId,
                    args: args
                }
            })
            // it waits for 5 seconds for a response, otherwise return undefined,
            // this way we don't keep the promise hanging for long.
            setTimeout(() => resolve(undefined), 5000)
        })
    }

    function recievedResultFromFunction({ functionCallId, result, error }) {
        const pendingEvaluation = pendingFunctionEvaluationsRef.current[functionCallId]
        if (pendingEvaluation !== undefined) {
            const pendingToResolve = pendingEvaluation.toResolve
            const pendingToRejet = pendingEvaluation.toReject
            if (pendingToResolve !== undefined && error === undefined) {
                pendingToResolve(result)
            } else if (pendingToRejet !== undefined && error !== undefined) {
                pendingToRejet(error)
            }
            
            delete pendingFunctionEvaluationsRef.current[functionCallId]
        }    
    }

    useNativeMessage((message) => {
        if (props[message.type] !== undefined) {
            recievedResultFromFunction(message.data)
        } if (message.type === 'loadprops') {
            let newProps = {}
            Object.entries(message.data).forEach(([key, value]) => {
                if (key.startsWith('function_')) {
                    key = key.replace('function_', '')
                    newProps[key] = funcHandler(key)
                } else {
                    newProps[key] = value
                }
            })
            setProps(newProps)
            setIsLoaded(true)
        } 
    })

    useEffect(() => {
        emit({ type: 'loadprops', data: {} })
    }, [])


    /*useEffect(() => {
        functionsRef.current = {
            dispatchChange,
            forceFocus,
            forceBlur
        }
    }, [dispatchChange, forceFocus, forceBlur])*/
    return isLoaded === true ? <div ref={editorRef}/> : null
}

export default webViewRender(<RootCodeEditor />)
