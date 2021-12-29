import { useState, useEffect, useRef } from 'react'
import Layouts from './layouts'

export default function Home(props) {
    const isMountedRef = useRef(false)
    const [isResizing, setIsResizing] = useState(false)
    const [isFloatingSidebar, setIsFloatingSidebar] = useState(false)
    const [isOpenSidebar, setIsOpenSidebar] = useState(false)
    const [isToPreventSidebarCollapse, setIsToPreventSidebarCollapse] = useState(false)

    /**
     * / *  WEB ONLY  * /
     * 
     * This function will be sent to the Sidebar component so we can enable or disable the sidebar from floating.
     * When the sidebar is set to floating we automatically close the sidebar, otherwise we automatically open it.
     */
    function onEnableOrDisableFloatingSidebar() {
        if (process.env['APP'] === 'web') {
            if (isFloatingSidebar) {
                setIsFloatingSidebar(false)
                setIsOpenSidebar(true)
            } else {
                setIsFloatingSidebar(true)
                setIsOpenSidebar(false)
            }
        }   
    }

    /**
     * / *  WEB ONLY  * /
     * 
     * This function will be sent to the Sidebar component so we can prevent the sidebar from collapsing
     * when we are moving the mouse inside of the sidebar.
     * 
     * @param {boolean} isToPreventSidebarCollapse - This is a boolean that will tell if the sidebar can be collapsed
     * or not. The idea is that when the user is moving the mouse inside of the sidebar the sidebar cannot be collapsed
     * but when he moves away than the sidebar is able to be collapsed.
     */
    function onPreventSidebarCollapse(isToPreventSidebarCollapse) {
        if (process.env['APP'] === 'web') {
            setIsToPreventSidebarCollapse(isToPreventSidebarCollapse)
        }
    }

    /**
     * / *  WEB ONLY  * /
     * 
     * This will open or close the sidebar whenever the user reaches the corner of the screen with the mouse.
     * This is a behaviour similar to how notion does in it's sidebar. 
     * If the user is moving the mouse IN the sidebar than we need to make sure to ignore this so we don't close
     * the sidebar. When the user moves away from the sidebar or leave the sidebar content we close the sidebar.
     * 
     * @param {import('react').MouseEvent} event - The 'onMouseMove' event that triggered this function.
     */
    function onMouseMoveOpenSidebar(event) {
        if (process.env['APP'] === 'web') {
            const MIN_WIDTH_TO_OPEN_SIDEBAR = 50
            if (isFloatingSidebar) {
                const canOpenSidebar = event.pageX <= MIN_WIDTH_TO_OPEN_SIDEBAR && event.pageX >= 0 && isOpenSidebar === false
                const canCloseSidebar = (event.pageX > MIN_WIDTH_TO_OPEN_SIDEBAR || event.pageX < 0) && 
                    isOpenSidebar === true && isToPreventSidebarCollapse === false && isResizing === false
                
                if (canOpenSidebar) {
                    setIsOpenSidebar(true)
                } else if (canCloseSidebar) {
                    setIsOpenSidebar(false)
                }
            }
        }
    }

    /**
     * / *  WEB ONLY  * /
     * 
     * This is used to change the state wheather the sidebar is being resized or not. By doing this we can prevent
     * the sidebar from automatically collapsing and disable the transition effect so the user can have a smooth 
     * resizing feeling.
     */
    function onResize(isResizing) {
        if (process.env['APP'] === 'web') {
            setIsResizing(isResizing)
        }
    }
    
    /**
     * / *  WEB ONLY  * /
     * 
     * This is used when the user resize the window to prevent the transition animation effect from happening
     * so it doesn't look slugish or buggy.
     */
    let afterResize = null
    function onResizeWindow() {
        if (process.env['APP'] === 'web') {
            onResize(true)
            clearTimeout(afterResize)
            afterResize = setTimeout(() => {
                if (isMountedRef.current === true) {
                    onResize(false)
                }
            }, 100)
        }
    }

    useEffect(() => {
        isMountedRef.current = true
        window.addEventListener('resize', onResizeWindow)
        return () => {
            isMountedRef.current = false
            window.removeEventListener('resize', onResizeWindow)
        }
    }, [])

    return process.env['APP'] === 'web' ? (
        <Layouts.Web
        onResize={onResize}
        isResizing={isResizing}
        setIsOpenSidebar={setIsOpenSidebar}
        onEnableOrDisableFloatingSidebar={onEnableOrDisableFloatingSidebar}
        isFloatingSidebar={isFloatingSidebar}
        isOpenSidebar={isOpenSidebar}
        onPreventSidebarCollapse={onPreventSidebarCollapse}
        onMouseMoveOpenSidebar={onMouseMoveOpenSidebar}
        />
    ) : (
        <Layouts.Mobile/>
    )
}