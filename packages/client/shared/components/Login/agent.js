import { requests } from '../../utils/agent'

/**
 * This agent is used to authenticate the user inside of reflow and log him in.
 */
function authenticate(username, password) {
    return requests.post('/authentication/login', {
        body: {
            username: username,
            password: password
        }
    })
}

export default {
    authenticate
}