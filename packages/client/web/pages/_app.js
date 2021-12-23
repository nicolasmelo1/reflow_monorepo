import { useEffect } from 'react'

/**
 * This will override the default app implementation of next. This was actually created by default when we created
 * this next application.
 * 
 * Reference: https://nextjs.org/docs/advanced-features/custom-app
 */
function MyApp({ Component, pageProps } = {}) {
    /**
     * This will run when the app is loaded on the screen. The idea is that this will calculate the
     * width and height of the app so we can use both variables inside of CSS.
     * 
     * This will also add the eventListener of resizing to the function so when the user resize the screen
     * the app-height and app-width variables will also change.
     */
    function setAppDefaults() {
        if (window !== undefined) {
            document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`)
            document.documentElement.style.setProperty('--app-width', `${window.innerWidth}px`)

            window.removeEventListener('resize', setAppDefaults)
            window.addEventListener('resize', setAppDefaults)
        }
    }

    useEffect(() => {
        setAppDefaults()
    }, [])

    return (
        <Component {...pageProps} />
    )
}

export default MyApp
