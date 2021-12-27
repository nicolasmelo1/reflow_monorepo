import { useState, useContext } from 'react'
import Layouts from './layouts'
import loginAgent from './agent'
import AuthenticationContext from './contexts/authentication'

const Login = (props) => {
    const { setIsAuthenticated } = useContext(AuthenticationContext) 
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    function onSubmit() {
        loginAgent.authenticate(username, password).then(response => {
            if (response && response.status === 200) {
                setIsAuthenticated(true)
                props.onLoginSuccessful()
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