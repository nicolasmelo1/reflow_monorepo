import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginPage, TestePage } from '../pages'


const UnauthenticatedRoutes = (props) => {
    const Stack = createNativeStackNavigator()

    return (
        <Stack.Navigator initialRouteName='teste'>
            <Stack.Screen name={'Teste'} component={TestePage} options={{title: 'Teste'}}/>
            <Stack.Screen name={'Login'} component={LoginPage} options={{title: 'Login'}}/>
        </Stack.Navigator>
    )
}

export default UnauthenticatedRoutes