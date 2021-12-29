import { useRef, useState, useEffect, useContext } from 'react'
import Layouts from './layouts'
import homeAgent from '../../agent'
import { UserContext } from '../../../authentication/contexts'
import { AreaContext } from '../../contexts'

/**
 * This component is the sidebar. It will hold all of the workspaces of the user as well the 
 * menus like `Quick Search`, `History`, etc.
 * 
 * This is one of the main forms of navigation of the user inside of reflow between each app.
 * 
 * @param {object} props - This is all of the props that you can pass to this component.
 * / * WEB ONLY * /
 * @param {function} props.onEnableOrDisableFloating - This is a function that will enable or disable the sidebar from floating.
 * @param {boolean} [props.isFloating=false] - This is a boolean that will tell if the sidebar is floating or not.
 * Floating means that the sidebar will appear above of the content.
 * @param {boolean} [props.isOpen=true] - When the sidebar is floating or not we can open or close it. When it is 
 * floating we are able to open or close moving the mouse, when it is not floating then we need to click a button.
 * @param {function} props.onPreventSidebarCollapse - This is a function that will prevent the sidebar from 
 * collapsing when the user is moving the mouse inside of the sidebar.
 */
function Sidebar(props) {
    const { user } = useContext(UserContext)
    const { areas, setAreas } = useContext(AreaContext)
    const isResizingRef = useRef(false)
    const [isResizing, _setIsResizing] = useState(false)
    const [openedWorkspacesIds, setOpenedWorspacesIds] = useState([])

    function setIsResizing(isResizing) {
        _setIsResizing(isResizing)
        isResizingRef.current = isResizing
    }
   
    /**
     * This function will open or close a workspace dropdown, that's the hole idea and concept.
     * By recieving a workspace id we can know if the state of the workspace dropdown is either closed or 
     * open by checking if the id is in the `openedWorkspacesIds` state array. If it is, then it's open
     * and we need to close, otherwise it's closed and we need to open.
     * 
     * @param {number} workspaceId - The workspaceId to check if it's closed or open.
     */
    function onOpenOrCloseWorkspaceDropdown(workspaceId) {
        if (openedWorkspacesIds.includes(workspaceId)) {
            setOpenedWorspacesIds([
                ...openedWorkspacesIds.filter(openedWorkspaceId => openedWorkspaceId !== workspaceId)
            ])
        } else {
            openedWorkspacesIds.push(workspaceId)
            setOpenedWorspacesIds([...openedWorkspacesIds])
        }
    }

    /**
     * / * WEB ONLY * /
     *  
     * This function will set the width of the sidebar. The width of the sidebar is saved on the localStorage
     * for when we need to retrieve it again. This way we can change the width of the sidebar in a browser tab
     * and be sure it will keep it that way when we reload the page or whatever.
     * 
     * Of course, this kind of behaviour is only needed if we are on the web, if we are using an app we don't need
     * to make this.
     * 
     * IMPORTANT: The sidebar cannot be resized for more than 1/3 of the screen width, and it cannot be less than 100px.
     * 
     * @param {number | null} sidebarWidth - The width of the sidebar, if this is set we will not create a default width
     * for the sidebar and also we will not retrive the width from the localStorage. If this is not null we understand
     * that the user is resizing the sidebar as he wish.
     */
    function defineWidthOfSidebar(sidebarWidth=null) {
        if (window !== undefined && process.env['APP'] === 'web') {
            if (sidebarWidth === null) {
                sidebarWidth = localStorage.getItem('sidebarWidth')
                if (sidebarWidth === null || sidebarWidth >= window.innerWidth/3) {
                    sidebarWidth = window.innerWidth/3
                }
            }
            if (sidebarWidth > 100 && sidebarWidth <= window.innerWidth/3) {
                localStorage.setItem('sidebarWidth', `${sidebarWidth}`)
                document.documentElement.style.setProperty('--sidebar-width', `${sidebarWidth}px`)
            }
        }
    }

    /**
     * / * WEB ONLY * /
     * 
     * This function is used for the user to be able to resize the sidebar. You will notice that this function
     * is tied to the document`s `onmousemove` event. We cannot tie this to the element itself because the mouse might 
     * be moving outside of the element.
     * 
     * We check if the mouse is moving and then we change the width of the sidebar from the x position, (the x position
     * start counting from the left of the screen, it's exactly where the sidebar is located so X is exactly 
     * the size of the sidebar)
     */
    function onResizeSidebar(e) {
        if (process.env['APP'] === 'web' && isResizingRef.current) {
            const sidebarWidth = e.clientX
            defineWidthOfSidebar(sidebarWidth)
        }
    }

    /**
     * / * WEB ONLY * /
     * 
     * This might be tricky but we only tie the `onmousemove` event to the document while we are resizing the sidebar.
     * after we finish resizing we need to remove the event listener from the document so we will not listen for mousemove
     * or mouseup anymore.
     * 
     * This also notify the parent component that the sidebar has stopped resizing.
     */
    function onStopResizingSidebar() {
        if (isResizingRef.current === true) {
            setIsResizing(false)
            props.onResizeSidebar(false)
        }
        
        document.removeEventListener('mousemove', onResizeSidebar)
        document.removeEventListener('mouseup', onStopResizingSidebar)
    }

    /**
     * / * WEB ONLY * /
     * 
     * This function is used for the user to be able to resize the sidebar. You will notive that when we start the resizing operation
     * we add two listeners to the document to see where the mouse is located. That's the hole idea. We do not attach this
     * when the component is loaded but when we are resizing so we prevent unwanted behaviours from happening.
     */
    function onStartResizingSidebar() {
        setIsResizing(true)
        props.onResizeSidebar(true)

        document.addEventListener('mousemove', onResizeSidebar)
        document.addEventListener('mouseup', onStopResizingSidebar)
    }

    useEffect(() => {
        defineWidthOfSidebar()
    }, [])

    /**
     * The first thing we do when we load the application is get the workspaces of the user that he has access 
     * to.
     */
    useEffect(() => {
        if (user.workspaces.length > 0) {
            homeAgent.getAreas(user.workspaces[0].uuid).then(response => {
                setAreas(response.data.data)
            })
        }
    }, [user])

    return process.env['APP'] === 'web' ? (
        <Layouts.Web
        user={user}
        workspaces={areas}
        isResizing={isResizing}
        onStartResizingSidebar={onStartResizingSidebar}
        onOpenOrCloseWorkspaceDropdown={onOpenOrCloseWorkspaceDropdown}
        onEnableOrDisableFloating={props.onEnableOrDisableFloating}
        openedWorkspacesIds={openedWorkspacesIds}
        isFloating={props.isFloating}
        isOpen={props.isOpen}
        onPreventSidebarCollapse={props.onPreventSidebarCollapse}
        />
    ) : (
        <Layouts.Mobile/>
    )
}


export default Sidebar