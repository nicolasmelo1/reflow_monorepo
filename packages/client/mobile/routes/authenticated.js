import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomePage } from '../pages'


const AuthenticatedRoutes = (props) => {
    const Stack = createNativeStackNavigator()

    return (
        <Stack.Navigator>
            <Stack.Screen name={'Home'} component={HomePage} options={{headerShown: false, title: 'Home'}}/>
        </Stack.Navigator>
    )
}

export default AuthenticatedRoutes