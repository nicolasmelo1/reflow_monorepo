import Main from './components/Main'
import { NavigationContainer } from '@react-navigation/native'
import GlobalProvider from '../shared/components/Core/contexts'
import * as Linking from 'expo-linking'

export default function App() {
    const linking = {
        prefixes: [Linking.makeUrl('/')],
        config: {
            screens: {
                Login: {
                    path: 'login'
                },
                Teste: {
                    path: 'teste'
                },
                Home: {
                    path: 'home'
                }
            }
        }
    }

    Linking.getInitialURL().then(response => console.log(response))
    return (
        <GlobalProvider.Provider>
            <NavigationContainer linking={linking}>
                <Main/>
            </NavigationContainer>
        </GlobalProvider.Provider>
    )
}