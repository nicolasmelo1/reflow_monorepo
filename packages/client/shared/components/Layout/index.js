import Layouts from './layouts'
import { library } from '@fortawesome/fontawesome-svg-core'
import { ThemeProvider } from 'styled-components'
import themes from '../../utils/themes'
import { 
    faChevronDown,
    faChevronRight,
    faSearch,
    faHistory,
    faCog,
 } from '@fortawesome/free-solid-svg-icons'

// This is needed for tree shaking, so we do not load all icons in memory and we do not need to load all
// icons when we build the application.
// Reference: https://fontawesome.com/v5.15/how-to-use/on-the-web/using-with/react#using
library.add(faChevronDown, faChevronRight, faSearch, faHistory, faCog)

/**
 * This is the main component of the page, we use this custom layout component so pages can override from this.
 * IMPORTANT: When you create a new Page, PLEASE use this component as the first tag of your page.
 * 
 * @param {object} props - This is all of the props that you can pass to this component.
 * 
 * @returns {import('React').Component} - Returns a React component. Can be either a mobile component or a web component.
 */
function Layout(props) {
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