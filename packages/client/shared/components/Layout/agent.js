import { requests } from '../../utils/agent'

/**
 * This will request a new refresh and access token to the application to make the request again.
 * 
 * @param {string} refreshToken - The token that will be use to request a new token, this token only serves
 * this purpose, you cannot refresh the token without this token.
 */
function refreshToken(refreshToken) {
    return requests.get('/authentication/refresh_token', {
        headers: {
            Authorization: `Client ${refreshToken}`
        }
    })
}

export default {
    refreshToken
}