import { useState, useContext } from 'react'
import Layouts from './layouts'
import loginAgent from './agent'
import AuthenticationContext from './contexts/authentication'
import { setTokens } from '../../utils/agent/utils'

/**
 * This component is supposed to log the user inside of reflow. This component is not opinionated on what it does after the user
 * logs in. This is because we might use the login in many places and not just the platform itself.
 * 
 * For example, we can have an OAuth login that will call a callback and redirect the user to other platform after the user logs in.
 * We can request a login to permit or enable some interaction on the platform and so on. The idea is that login will need to be used
 * and reused inside of the application although it looks like something static.
 * 
 * So your redirects, the data you need to retrieve, those all will be handled inside your page component directly.
 * 
 * @param {object} props - The props of the component that it recieves.
 * @param {string} props.onLoginSuccessful - This is the function that is called after a successful login inside of reflow.
 * 
 * @returns {import('react').Component} - Returns the login formulary that is displayed to the user.
 */
const Login = (props) => {
    const { setIsAuthenticated } = useContext(AuthenticationContext) 
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    /**
     * Function called when we want to log the user in and he clicks the button to login inside of the application.
     */
    function onSubmit() {
        loginAgent.authenticate(username, password).then(response => {
            if (response && response.status === 200) {
                setIsAuthenticated(true)
                setTokens(response.data.data.accessToken, response.data.data.refreshToken).then(() => {
                    props.onLoginSuccessful()
                })
            }
        })
    }

    return process.env['APP'] === 'web' ? (
        <Layouts.Web
        username={username}
        password={password}
        onChangeUsername={setUsername}
        onChangePassword={setPassword}
        onSubmit={onSubmit}
        />
    ) : (
        <Layouts.Mobile/>
    )
}

export default Login