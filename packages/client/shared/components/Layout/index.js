import Layouts from './layouts'

/**
 * This is the main component of the page, we use this custom layout component so pages can override from this.
 * IMPORTANT: When you create a new Page, PLEASE use this component as the first tag of your page.
 * 
 * @param {object} props - This is all of the props that you can pass to this component.
 * 
 * @returns {import('React').Component} - Returns a React component. Can be either a mobile component or a web component.
 */
function Layout(props) {
    return process.env['APP'] === 'web' ? (
        <Layouts.Web 
        children={props.children}
        />
    ) : (
        <Layouts.Mobile 
        children={props.children}
        />
    )
}

module.exports = Layout