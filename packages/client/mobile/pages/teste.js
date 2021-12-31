import { useRef } from 'react'
import { Layout, Login } from '../../shared'
import { View, Text } from 'react-native'
import { useClickedOrPressedOutside } from '../../shared/core/hooks'

export default function TestePage(props) {
    const containerRef = useRef()
    useClickedOrPressedOutside({ ref: containerRef, callback: teste })

    function teste(e) {
        console.log('teste')
    }

    return (
        <Layout>
            <View
            ref={containerRef}
            style={{
                backgroundColor: 'green',
                width: 100,
                height: 100,
            }}
            >
                <Text>
                    {'ALOU'}
                </Text>
                </View>
        </Layout>
    )
}