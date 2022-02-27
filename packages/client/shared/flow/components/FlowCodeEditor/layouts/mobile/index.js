import React from 'react'
import webView from './webView'
import { dynamicImport } from '../../../../../core/utils'
 
const WebView = dynamicImport('react-native-webview')
const useWebViewMessage = dynamicImport('react-native-react-bridge', 'useWebViewMessage')

/**
 * 
 */
export default function FlowMobileCodeEditor(props) {
    const { ref, onMessage, emit } = useWebViewMessage((message) => {
        if (props[message.type] !== undefined) {
            const { args, functionCallId } = message.data
            Promise.resolve(props[message.type](...args))
                .then(result => emit({ 
                    type: message.type, 
                    data: {
                        functionCallId: functionCallId,
                        result,
                        error: undefined
                    } 
                }))
                .catch(error => emit({ 
                    type: message.type, 
                    data: {
                        functionCallId: functionCallId,
                        result: undefined,
                        error
                    }
                }))
        } if (message.type === 'loadprops') {
            sendPropsToWebView()
        } 
    })

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
            onMessage={onMessage}
            onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.warn('WebView error: ', nativeEvent);
            }}
        />
    ) 
}