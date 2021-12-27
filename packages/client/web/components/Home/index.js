import { useState } from 'react'
import Head from '../Head'
import Styled from './styles'
import { Layout, Sidebar } from '../../../shared/components'

/**
 * This is the home page of the app, the homepage of the app is the first and usually te only page the user will see inside of the 
 * aplication.
 */
export default function HomePage(props) {
    const [isFloatingSidebar, setIsFloatingSidebar] = useState(false)
    const [isOpenSidebar, setIsOpenSidebar] = useState(false)
    const [isToPreventSidebarCollapse, setIsToPreventSidebarCollapse] = useState(false)

    /**
     * This function will be sent to the Sidebar component so we can enable or disable the sidebar from floating.
     * When the sidebar is set to floating we automatically close the sidebar, otherwise we automatically open it.
     */
    function onEnableOrDisableFloatingSidebar() {
        if (isFloatingSidebar) {
            setIsFloatingSidebar(false)
            setIsOpenSidebar(true)
        } else {
            setIsFloatingSidebar(true)
            setIsOpenSidebar(false)
        }
    }

    /**
     * This function will be sent to the Sidebar component so we can prevent the sidebar from collapsing
     * when we are moving the mouse inside of the sidebar.
     */
    function onPreventSidebarCollapse() {
        setIsToPreventSidebarCollapse(!isToPreventSidebarCollapse)
    }

    /**
     * This will open or close the sidebar whenever the user reaches the corner of the screen with the mouse.
     * This is a behaviour similar to how notion does in it's sidebar. 
     * If the user is moving the mouse IN the sidebar than we need to make sure to ignore this so we don't close
     * the sidebar. When the user moves away from the sidebar or leave the sidebar content we close the sidebar.
     * 
     * @param {import('react').MouseEvent} event - The 'onMouseMove' event that triggered this function.
     */
    function onMouseMoveOpenSidebar(event) {
        const MIN_WIDTH_TO_OPEN_SIDEBAR = 50
        if (isFloatingSidebar) {
            if (event.pageX <= MIN_WIDTH_TO_OPEN_SIDEBAR && event.pageX >= 0 && isOpenSidebar === false) {
                setIsOpenSidebar(true)
            } else if ((event.pageX > MIN_WIDTH_TO_OPEN_SIDEBAR || event.pageX < 0) && isOpenSidebar === true && isToPreventSidebarCollapse === false) {
                setIsOpenSidebar(false)
            }
        }
    }

    return (
        <Layout>
            <Head
            title={'Home'}
            />
            <Styled.ContentContainer
            onMouseMove={(e) => onMouseMoveOpenSidebar(e)}
            >
                <Sidebar
                onEnableOrDisableFloating={onEnableOrDisableFloatingSidebar}
                isFloating={isFloatingSidebar}
                isOpen={isOpenSidebar}
                onPreventSidebarCollapse={onPreventSidebarCollapse}
                />
                <div>
                    {isFloatingSidebar ? '' : (
                        <button
                        onClick={() => setIsOpenSidebar(!isOpenSidebar)}
                        >
                            Sidebar
                        </button>
                    )}
                    <h2> Teste </h2>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                </div>
            </Styled.ContentContainer>
        </Layout>
    )
}