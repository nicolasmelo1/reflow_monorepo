import Head from '../Head'
import { Layout, Login } from '../../../shared/components'
import { useRouter } from 'next/router'

export default function LoginPage(props) {
    const router = useRouter()

    function onLoginSuccessful() {
        router.push('/teste/teste')
    }
    
    return (
        <Layout>
            <Head
            title={'Login'}
            />
            <Login
            onLoginSuccessful={onLoginSuccessful}
            />
        </Layout>
    )
}