import { useContext } from 'react'
import { HomeDefaultsContext } from '../../contexts'
import Layout from './layout'

/**
 * This is component holds the app. The app is this place at the right side of the sidebar and below the 
 * workspace top bar.
 */
export default function App(props) {
    const { state: { selectedApp }} = useContext(HomeDefaultsContext)

    return (
        <Layout
        app={selectedApp}
        isSidebarFloating={props.isSidebarFloating}
        isSidebarOpen={props.isSidebarOpen}
        />
    )
}