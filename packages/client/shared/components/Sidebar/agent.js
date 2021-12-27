import { requests } from '../../utils/agent'


function testToken() {
    return requests.get('/authentication/test_token')
}

export default {
    testToken
}