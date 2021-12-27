import Head from '../Head'
import { Layout, Login } from '../../../shared/components'

export default function LoginPage(props) {
    return (
        <Layout>
            <Head
            title={'Login'}
            />
            <Login/>
        </Layout>
    )
}