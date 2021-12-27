import { createElement } from 'react'

/**
 * This provides a way to create a global state that can be used in any component inside the application.
 * 
 * It's a REALLY simple api that will work with any context api created. This way to define it as a global context
 * you need to register your context using `registerProviders` function here.
 * 
 * For example:
 * 
 * 1. First we have to create the context as well as the provider (creating the provider is EXTREMELY important)
 * IMPORTANT: In the provider look that we pass {props.children} in the render. This is important.
 * ```
 * const initialState = {
 *   state: {
 *       isAuthenticated: false,
 *   },
 *   setState() = {}
 * }
 * export const AuthenticationContext = createContext(initialState)
 * 
 * function AuthenticationProvider(props) {
 *      const [state, setState] = useState(initialState.state)
 * 
 *      return (
 *          <AuthenticationContext.Provider value={{
 *              state,
 *              setState,
 *          }}>
 *              {props.children}
 *          </AuthenticationContext.Provider>
 *      )
 * }
 * ```
 * 
 * 2. Now we need to register the provider using the `registerProviders` function.
 * ```
 * GlobalProvider.registerProviders(AuthenticationProvider)
 * ```
 * 
 * That's it, now you have this context registered as global.
 * 
 * So how to use it?
 * 
 * Above everything, in your App.js or your custom next.js _app.js file you need to import this GlobalProvider and define 
 * it like this:
 * ```
 * function MyApp({ Component, pageProps } = {}) {
 *      return (
 *          <GlobalProvider.Provider>
 *              <Main>
 *                  <Component {...pageProps} />
 *              </Main>
 *          </GlobalProvider.Provider>
 *      )
 * }
 * ```
 * 
 * Really simple, and an API without needing redux, we can also add persist functionality to persist the state without complicated
 * stuff like redux. I know this code seems kinda complicated at first, but trust me, it's simpler than redux. Redux is too bloated
 * and complex.
 * 
 * @returns {{
 *     registerProviders: (function(props): React.Component),
 *     Provider: React.Component
 * }} - Returns an object with registerProviders function to add a provider and Provider component to be used.
 */
function GlobalProviderInitializer() {
    const providers = []

    return {
        /**
         * Is used for registering a provider (It's nice because we only register the contexts that are actually used by the code.)
         * You need to pass a react component that will be used as a provider for your context to be available to all.
         * 
         * @param {React.Component} provider - The provider that will be used to register the context.
         */
        registerProviders: (provider) => {
            providers.push(provider)
        }, 
        Provider: (props) => {
            /**
             * This is kinda strange but we need to render here without JSX to compose one component inside of other, this way
             * we will have a global context to use similar to how redux works but A LOT easier.
             * 
             * This gives us a really nice explanation on how createElement works:
             * https://stackoverflow.com/a/70279264
             * 
             * It's specially useful for functional components like what we use here.
             */
            const getProviders = () => {
                let LastComponent = props.children
                for (let i=0; i<providers.length; i++) {
                    LastComponent = createElement(providers[i], null, LastComponent)
                }
                return LastComponent
            }
            return getProviders()
        }
    }
}

export default GlobalProviderInitializer()