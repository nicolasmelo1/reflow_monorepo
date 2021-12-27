import { useEffect, useContext } from 'react'
import Layouts from './layouts'
import { library } from '@fortawesome/fontawesome-svg-core'
import { ThemeProvider } from 'styled-components'
import themes from '../../utils/themes'
import { paths } from '../../utils/constants'
import { exceptionObserver as agentExceptionObserver, getRefreshToken } from '../../utils/agent/utils'
import AuthenticationContext from '../Login/contexts/authentication'
import layoutAgent from './agent'
import { 
    faChevronDown,
    faChevronLeft,
    faChevronRight,
    faSearch,
    faHistory,
    faCog,
 } from '@fortawesome/free-solid-svg-icons'
import { useRouterOrNavigationRedirect } from '../../utils/hooks'

// This is needed for tree shaking, so we do not load all icons in memory and we do not need to load all
// icons when we build the application.
// Reference: https://fontawesome.com/v5.15/how-to-use/on-the-web/using-with/react#using
library.add(faChevronDown, faChevronLeft, faChevronRight, faSearch, faHistory, faCog)

/**
 * This is the main component of the page, we use this custom layout component so pages can override from this.
 * IMPORTANT: When you create a new Page, PLEASE use this component as the first tag of your page.
 * 
 * @param {object} props - This is all of the props that you can pass to this component.
 * 
 * @returns {import('React').Component} - Returns a React component. Can be either a mobile component or a web component.
 */
function Layout(props) {
    const { state: { isAuthenticated }, setIsAuthenticated } = useContext(AuthenticationContext) 
    const redirect = useRouterOrNavigationRedirect()

    function redirectToLogin() {
        redirect(paths.login.asUrl)
    }

    /**
     * This will get the refresh token from the local storage or from the async storage, request for new tokens and after that
     * we will make the request again with the new tokens by calling the `makeRequestAgain` function.
     * 
     * @param {string} reason - The error recieved from the backend.
     * @param {function} makeRequestAgain - A function to be called to make the request again so we can get the response
     * of the request without issues when refreshing the new token.
     */
    async function handleRefreshToken(reason, makeRequestAgain) {
        let isToRedirectUserToLogin = true
        if (reason === 'expired_token') {
            const refreshToken = await getRefreshToken()
            const response = await layoutAgent.refreshToken(refreshToken)

            if (response && response.status === 200) {
                const accessToken = response.data.accessToken
                const refreshToken = response.data.refreshToken
                isToRedirectUserToLogin = false
                await setTokens(accessToken, refreshToken)
                makeRequestAgain()
            }
        }
        if (isToRedirectUserToLogin) {
            setIsAuthenticated(false)
            redirectToLogin()
        }
    }

    /**
     * This will handle when the user is unauthenticated inside of reflow. When this happens what we do is that we 
     * will try to get the refresh token ant then we will try to make the request again, if not possible we will redirect
     * the user to the login page.
     * 
     * @param {import('axios').Response} response - This is the response from axios so we can send the request again.
     * @param {function} makeRequestAgain - This is the function that will be called to make the request again when all of the handlers
     * have been fired. This will guarantee that however is making the request will be able to 
     */
    async function handleUnauthenticated(response, makeRequestAgain) {
        if (response && response?.data?.error?.reason && ['invalid_token', 'login_required', 'expired_token'].includes(response.data.error.reason)) {
            await handleRefreshToken(response.data.error.reason, makeRequestAgain)
        }
    }

    useEffect(() => {
        agentExceptionObserver.addCallback(handleUnauthenticated)
    }, [])

    return (
        <ThemeProvider theme={themes.default}>
            {process.env['APP'] === 'web' ? (
                <Layouts.Web 
                children={props.children}
                />
            ) : (
                <Layouts.Mobile 
                children={props.children}
                />
            )}
        </ThemeProvider>
    )
}

module.exports = Layout