import { configureConf } from '../../shared/conf'
import Main from '../components/Main'
import GlobalProvider from '../../shared/core/contexts'

configureConf({
    apiHost: 'http://localhost:4000'
})

/**
 * This will override the default app implementation of next. This was actually created by default when we created
 * this next application.
 * 
 * Reference: https://nextjs.org/docs/advanced-features/custom-app
 */
function MyApp({ Component, pageProps } = {}) {
    return (
        <GlobalProvider.Provider>
            <Main>
                <Component {...pageProps} />
            </Main>
        </GlobalProvider.Provider>
    )
}

export default MyApp
