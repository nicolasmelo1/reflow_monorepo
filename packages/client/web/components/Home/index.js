import Head from '../Head'
import Styled from './styles'
import { Layout, Sidebar } from '../../../shared/components'

/**
 * This is the home page of the app, the homepage of the app is the first and usually te only page the user will see inside of the 
 * aplication.
 */
export default function Home(props) {
    return (
        <Layout>
            <Head
            title={'Home'}
            />
            <Styled.ContentContainer>
                <Sidebar/>
                <div>
                    <h2> Teste </h2>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                </div>
            </Styled.ContentContainer>
        </Layout>
    )
}