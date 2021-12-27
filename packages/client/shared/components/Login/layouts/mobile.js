import { SafeAreaView, View, Text } from 'react-native'

/**
 * This is the main layout of the app. All of your pages should has this as the first component.
 */
function LoginMobileLayout(props) {
    return (
        <SafeAreaView>
            <View style={{
                backgroundColor: 'red',
                width: 100,
                height: 100,
            }}>
                <Text>
                    Aqui é o login
                </Text>
            </View>
        </SafeAreaView>
    )
}

export default LoginMobileLayout