import { useState, useEffect } from 'react'
import Layouts from './layouts'
import sidebarAgent from './agent'

const workspacesMock = [{
    id: 1,
    labelName: 'Vendas',
    apps: [
        {
            id: 1,
            labelName: 'Gestão',
        },
        {
            id: 2,
            labelName: 'Automação',
        }
    ]
},{
    id: 2,
    labelName: 'Recursos Humanos',
    apps: [
        {
            id: 3,
            labelName: 'Contratação Designer',
        }
    ]
}]

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
    const [sidebarWidth, setSidebarWidth] = useState(300)
    const [openedWorkspacesIds, setOpenedWorspacesIds] = useState([])

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
     * / * WEBONLY * /
     *  
     * This function will set the width of the sidebar. The width of the sidebar is saved on the localStorage
     * for when we need to retrieve it again. This way we can change the width of the sidebar in a browser tab
     * and be sure it will keep it that way when we reload the page or whatever.
     * 
     * Of course, this kind of behaviour is only needed if we are on the web, if we are using an app we don't need
     * to make this.
     */
    function defineWidthOfSidebar() {
        if (window !== undefined && process.env['APP'] === 'web') {
            let sidebarWidth = localStorage.getItem('sidebarWidth')
            if (sidebarWidth === null) {
                sidebarWidth = window.innerWidth/3
                document.documentElement.style.getPropertyValue()
                document.documentElement.style.setProperty('--sidebar-width', `${sidebarWidth}px`)
                localStorage.setItem('sidebarWidth', `${sidebarWidth}px`)
            } else {
                document.documentElement.style.setProperty('--sidebar-width', `${sidebarWidth}px`)
            }
            setSidebarWidth(sidebarWidth)
        }
    }

    useEffect(() => {
        defineWidthOfSidebar()
        sidebarAgent.testToken()
    }, [])

    return process.env['APP'] === 'web' ? (
        <Layouts.Web
        workspaces={workspacesMock}
        openedWorkspacesIds={openedWorkspacesIds}
        onOpenOrCloseWorkspaceDropdown={onOpenOrCloseWorkspaceDropdown}
        onEnableOrDisableFloating={props.onEnableOrDisableFloating}
        isFloating={props.isFloating}
        isOpen={props.isOpen}
        sidebarWidth={sidebarWidth}
        onPreventSidebarCollapse={props.onPreventSidebarCollapse}
        />
    ) : (
        <Layouts.Mobile/>
    )
}


export default Sidebar