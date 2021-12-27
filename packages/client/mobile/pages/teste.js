import { Layout, Login } from '../../shared/components'
import { View } from 'react-native'

export default function TestePage(props) {
    return (
        <Layout>
            <View
            style={{
                backgroundColor: 'green',
                width: 100,
                height: 100,
            }}
            />
        </Layout>
    )
}