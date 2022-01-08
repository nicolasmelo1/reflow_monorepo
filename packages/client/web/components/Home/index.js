import { useRouter } from 'next/router'
import Head from '../Head'
import { Layout, Home } from '../../../shared'

/**
 * This is the home page of the app, the homepage of the app is the first and usually te only page the user will see inside of the 
 * aplication.
 */
export default function HomePage(props) {
    const router = useRouter()

    return (
        <Layout>
            <Head
            title={'Home'}
            />
            <Home
            appUUID={router.query.appUUID}
            workspaceUUID={router.query.workspaceUUID}
            />
        </Layout>
    )
}