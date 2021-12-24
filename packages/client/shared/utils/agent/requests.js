import axios from 'axios'
import { API_HOST } from '../../conf'


const getUrl = (path) => {
    return `${API_HOST}${path}`
}

const requests = {
    /**
     * This will run a DELETE request for deleting an instance of something.
     * 
     * @param {object} reqOptions - The options of the request.
     * @param {string} reqOptions.url - The url that you are wanting to call to delete an instance of something.
     * @param {object} [reqOptions.params={}] - Please send a NON nested object. This is all of the parameters
     * you want to add in the url. It is a query string parameter.
     * @param {object} [reqOptions.headers={}] - Also the same as above, this is the header of the request. The object
     * that is sent, it's better if the keys are strings.
     * @param {axios.CancelToken | null} [reqOptions.source=null] - This is an axios source to cancel the request at 
     * a given time. This is used so for example: when we keep changing page or trying to extensively load the
     * same data over and over again, if the request has not been finished processing, then we will cancel the request.
     * 
     * @returns {import('axios').Response} - An axios response which will contain the data.
     */
    delete: async ({ url, params={}, headers={}, source=null } = {}) => {   
        if (!source) {
            const CancelToken = axios.CancelToken
            source = new CancelToken(function (_) {})
        }
        try {
            return await axios.delete(getUrl(url), {
                params: params,
                headers: Object.assign(setHeader(await getToken()), headers),
                cancelToken: source.token
            })
        }
        catch (exception) {
            if (!axios.isCancel(exception)) {
                return await exceptionHandler(exception.response, requests.delete, url, params, headers)
            }
        }
    },
    /**
     * This will run a GET request for retrieving an instance of something.
     * 
     * @param {object} reqOptions - The options of the request.
     * @param {string} reqOptions.url - The url that you are wanting to call to delete an instance of something.
     * @param {object} [reqOptions.params={}] - Please send a NON nested object. This is all of the parameters
     * you want to add in the url. It is a query string parameter.
     * @param {object} [reqOptions.headers={}] - Also the same as above, this is the header of the request. The object
     * that is sent, it's better if the keys are strings.
     * @param {axios.CancelToken | null} [reqOptions.source=null] - This is an axios source to cancel the request at 
     * a given time. This is used so for example: when we keep changing page or trying to extensively load the
     * same data over and over again, if the request has not been finished processing, then we will cancel the request.
     * 
     * @returns {import('axios').Response} - An axios response which will contain the data.
     */
    get: async ({ url, params={}, headers={}, source=null } = {}) => {
        // sources are available only in get requests, use them wiselly. With them you can cancel the request on the unmount of a component 
        // or when you change some data in your component. It's a really powerful tool to increase perfomance and mitigate possible bugs.
        if (!source) {
            const CancelToken = axios.CancelToken
            source = new CancelToken(function (_) {})
        }
        try {
            return await axios.get(getUrl(url), {
                params: params,
                headers: Object.assign(setHeader(await getToken()), headers),
                cancelToken: source.token
            })
        }
        catch (exception) {
            if (!axios.isCancel(exception)) {
                return await exceptionHandler(exception.response, requests.get, url, params, headers)
            }
        }
    },
    put: async ({ url, body={}, headers={}, source=null } = {}) => {
        if (!source) {
            const CancelToken = axios.CancelToken
            source = new CancelToken(function (_) {})
        }
        try {
            return await axios.put(getUrl(url), body, { 
                headers: Object.assign(setHeader(await getToken()), headers),
                cancelToken: source.token
            })
        }
        catch (exception) {
            return await exceptionHandler(exception.response, requests.put, url, body, headers)
        }
    },
    post: async ({ url, body={}, headers={}, source=null } = {}) => {
        if (!source) {
            const CancelToken = axios.CancelToken
            source = new CancelToken(function (_) {})
        }
        try {
            return await axios.post(getUrl(url), body, { 
                headers: Object.assign(setHeader(await getToken()), headers),
                cancelToken: source.token
            })
        }
        catch (exception) {
            if (!axios.isCancel(exception)) {
                return await exceptionHandler(exception.response, requests.post, url, body, headers)
            }
        }
    }
}
    