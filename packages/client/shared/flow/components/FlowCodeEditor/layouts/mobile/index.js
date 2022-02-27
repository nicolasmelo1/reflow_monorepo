import React from 'react'
import webView from './webView'
import { dynamicImport } from '../../../../../core/utils'
import { useDebugWebView } from '../../../../../core'

const WebView = dynamicImport('react-native-webview')
const useWebViewMessage = dynamicImport('react-native-react-bridge', 'useWebViewMessage')

/**
 * Most of the heavy lifting is done, but it is unfinished. The webview can call for functions
 * the native side, but the native side cannot call for functions in the webview side.
 * 
 * We need to be able to have a 2-way comunication between the webview and react-native.
 * 
 * The idea here is simple: We pass the functions recieved on the props as `function_${nameofthefunction}`
 * And this prop will have the null value.
 * 
 * Then, on the webview side, we get this function and append it to the state with a callback, this callback
 * is supposed to send a message here (on the native site) to retrieve the data. This message will contain
 * a functionId (In order to don't leave them hanging for a response) and the arguments as a list.
 * We use the args list and call the function that is being called. When we retrieve the data
 * we are looking for we send a message back to the webview with the response.
 * 
 * And that's basically it, that's the hole idea.
 * 
 * In order to call functions from the webview side we should do the same thing, but on the opposite direction.
 * 
 * One more thing: The webview doesn't have any props on first load, so when you load you should call 'loadprops'
 * in order to retrieve the formula of this function. Emitting `loadprops` changes the props on the webview side.
 */
export default function FlowMobileCodeEditor(props) {
    const { webViewDebugging, onDebugMessage } = useDebugWebView()
    const { ref, onMessage, emit } = useWebViewMessage((message) => {
        if (props[message.type] !== undefined) {
            const { args, functionCallId } = message.data
            callbackWasCalled(message.type, functionCallId, args)
        } if (message.type === 'loadprops') {
            sendPropsToWebView()
        } 
    })

    function callbackWasCalled(functionName, functionCallId, args) {
        Promise.resolve(props[functionName](...args))
            .then(result => emit({ 
                type: functionName, 
                data: {
                    functionCallId: functionCallId,
                    result,
                    error: undefined
                } 
            }))
            .catch(error => emit({ 
                type: functionName, 
                data: {
                    functionCallId: functionCallId,
                    result: undefined,
                    error
                }
            })
        )
    }

    function sendPropsToWebView() {
        let newProps = {}
        Object.entries(props).forEach(([key, value]) => {
            if (typeof value === 'function') {
                newProps[`function_${key}`] = null
            } else {
                newProps[key] = value
            }
        })
        emit({ type: 'loadprops', data: newProps })
    }


    return (
        <WebView
            // ref, source and onMessage must be passed to react-native-webview
            ref={ref}
            // Pass the source code of React app
            source={{ html: webView }}
            injectedJavaScript={webViewDebugging}
            onMessage={(event) => onDebugMessage(event, onMessage)}
            onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent
                console.warn('WebView error: ', nativeEvent)
            }}
        />
    ) 
}