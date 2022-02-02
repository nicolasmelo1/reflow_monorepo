import { requests } from '../core/agent'

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

/**
 * This agent will retrieve the actual user information from the backend.
 */
function getMe() {
    return requests.get('/authentication/me')
}

function getTypes() {
    return requests.get('/authentication/types')
}

export default {
    authenticate,
    getMe,
    getTypes
}