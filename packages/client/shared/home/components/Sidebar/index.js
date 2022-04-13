import { useRef, useState, useEffect, useContext } from 'react'
import homeAgent from '../../agent'
import { APP } from '../../../conf'
import { WorkspaceContext, UserContext } from '../../../authentication/contexts'
import { AreaContext, HomeContext } from '../../contexts'
import { generateUUID } from '../../../../../shared/utils'
import { useRouterOrNavigationRedirect } from '../../../core/hooks'
import { paths, strings } from '../../../core/utils/constants'
import Layout from './layouts'

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
export default function Sidebar(props) {
    const redirect = useRouterOrNavigationRedirect()
    const { user } = useContext(UserContext)
    const { state: { selectedWorkspace } } = useContext(WorkspaceContext)
    const { areas, setAreas, retrieveFromPersist, recursiveTraverseAreas } = useContext(AreaContext)
    const { setIsEditingArea } = useContext(HomeContext)
    const isResizingRef = useRef(false)
    const addWorkspaceButtonRef = useRef(null)
    const [editingAreaOrAppUUID, setEditingAreaOrAppUUID] = useState(null)
    const [isResizing, _setIsResizing] = useState(false)
    const [openedWorkspacesIds, setOpenedWorspacesIds] = useState([])
    const [isCreatingArea, setIsCreatingArea] = useState(false)

    function setIsResizing(isResizing) {
        _setIsResizing(isResizing)
        isResizingRef.current = isResizing
    }
    
    /**
     * THis function is async because we recursively check if the area name is unique or if has any other with the same name as this new area.
     * By default we use the `workspaceNewAreaName` to create a new area, so the new areas are always named the same with the only difference that
     * we add a number to the end of the name if it is repeated.
     * 
     * Besides that, there's nothing much to be said about this function.
     */
    async function retrieveNewArea() {
        function setupFoundCallback(newAreaLabelName) {
            return (area) => area.labelName === newAreaLabelName
        }
        const DEFAULT_NEW_AREA_NAME = strings('workspaceNewAreaName')
        let newAreaLabelName = DEFAULT_NEW_AREA_NAME
        let foundArea = await recursiveTraverseAreas(setupFoundCallback(newAreaLabelName), areas)
        let count = 1
        while (foundArea !== null) {
            newAreaLabelName = `${DEFAULT_NEW_AREA_NAME} ${count}`
            foundArea = await recursiveTraverseAreas(setupFoundCallback(newAreaLabelName), areas)
            count++
        }
        return {
            uuid: generateUUID(),
            labelName: newAreaLabelName,
            color: null,
            description: null,
            order: areas.length + 1,
            subAreaOfUUID: null,
            subAreas: [],
            apps: []
        }
    }

    /**
     * This will create a new area and add it to the areas array. The process is the following: First we retrieve the new area name (which will be an async function),
     * then we create the area in the database, and only after that we push this new area to the areas array.
     * 
     * After all that we redirect the user to the new area and we start the new area in the editing mode. WHile we are in the process of the upload of the new area in the
     * database, the user cannot create any new areas.
     */
    function onCreateArea() {
        if (isCreatingArea === false && selectedWorkspace.uuid !== null) {
            setIsCreatingArea(true)
            retrieveNewArea().then(newArea => {
                homeAgent.createArea(selectedWorkspace.uuid, newArea).then(response => {
                    if (response && response.status === 201) {
                        areas.push(newArea)
                        setIsEditingArea(true)
                        redirect(paths.workspace.asUrl.replace('{workspaceUUID}', newArea.uuid))
                    }
                    setIsCreatingArea(false)
                }).catch(e => {
                    setIsCreatingArea(false)
                })
            })
        }
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
    function webDefineWidthOfSidebar(sidebarWidth=null) {
        if (window !== undefined && APP === 'web') {
            const MAX_SIDEBAR_WIDTH = window.innerWidth - 100
            const MIN_SIDEBAR_WIDTH = 150

            if (sidebarWidth === null) {
                sidebarWidth = localStorage.getItem('sidebarWidth')
                if (sidebarWidth === null || sidebarWidth >= MAX_SIDEBAR_WIDTH || sidebarWidth <= MIN_SIDEBAR_WIDTH) {
                    sidebarWidth = window.innerWidth/3
                }
            }
            if (sidebarWidth > MIN_SIDEBAR_WIDTH && sidebarWidth <= MAX_SIDEBAR_WIDTH) {
                localStorage.setItem('sidebarWidth', `${sidebarWidth}`)
                document.documentElement.style.setProperty('--sidebar-width', `${sidebarWidth}px`)
            }
            const appHeight = window.innerHeight
            document.documentElement.style.setProperty('--sidebar-workspaces-height', `${appHeight - 250 - addWorkspaceButtonRef.current.clientHeight}px`)
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
    function webOnResizeSidebar(e) {
        if (APP === 'web' && isResizingRef.current) {
            const sidebarWidth = e.clientX
            webDefineWidthOfSidebar(sidebarWidth)
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
    function webStopResizingSidebar() {
        if (APP === 'web') {
            if (isResizingRef.current === true) {
                setIsResizing(false)
                props.webOnResizeSidebar(false)
            }
            
            document.removeEventListener('mousemove', webOnResizeSidebar)
            document.removeEventListener('mouseup', webStopResizingSidebar)
        }
    }

    /**
     * / * WEB ONLY * /
     * 
     * This function is used for the user to be able to resize the sidebar. You will notive that when we start the resizing operation
     * we add two listeners to the document to see where the mouse is located. That's the hole idea. We do not attach this
     * when the component is loaded but when we are resizing so we prevent unwanted behaviours from happening.
     */
    function webOnStartResizingSidebar() {
        if (APP === 'web') {
            setIsResizing(true)
            props.webOnResizeSidebar(true)

            document.addEventListener('mousemove', webOnResizeSidebar)
            document.addEventListener('mouseup', webStopResizingSidebar)
        }
    }

    /**
     * We update by reference so we don't need to traverse the array everytime an workspace has changed.
     * 
     * This is better explained in `Sidebar.Dropdown` component.
     * 
     * If onChangeArea is defined we will call this function so we can change in the home screen the name of the selected area.
     * 
     * @param {{
     *  uuid: string, 
     *  description: string, 
     *  color: string | null,
     *  labelName: string,
     *  name: string,
     *  order: number,
     *  subAreas: Array<object>,
     *  subAreaOfUUID: string,
     *  apps: Array<{}>
     * }} workspaceData - this is the new data for the area.
     */
    function onChangeWorkspace(workspaceData) {
        if (props.onChangeArea !== undefined && typeof props.onChangeArea === 'function') {
            props.onChangeArea(workspaceData)
        }
        return setAreas([...areas])
    }

    useEffect(() => {
        if (APP === 'web') {
            webDefineWidthOfSidebar()
            window.addEventListener('resize', webDefineWidthOfSidebar)
        }
        return () => {
            if (APP === 'web') {
                window.removeEventListener('resize', webDefineWidthOfSidebar)
            }
        }
    }, [])

    /**
     * The first thing we do when we load the application is get the workspaces of the user that he has access 
     * to.
     */
    useEffect(() => {
        if (selectedWorkspace.uuid !== null) {
            homeAgent.getAreaTypes().then(areaTypes => {
                homeAgent.getAreas(selectedWorkspace.uuid).then(response => {
                    if (response && response.status === 200) {
                        setAreas(response.data.data)
                    } else {
                        retrieveFromPersist()
                    }
                }).catch(e => {
                    retrieveFromPersist()
                })
            }).catch(e => {
                retrieveFromPersist()
            })
        }
    }, [selectedWorkspace])

    return (
        <Layout
        user={user}
        addWorkspaceButtonRef={addWorkspaceButtonRef}
        workspaces={areas !== undefined ? areas : []}
        isResizing={isResizing}
        editingAreaOrAppUUID={editingAreaOrAppUUID}
        setEditingAreaOrAppUUID={setEditingAreaOrAppUUID}
        webOnStartResizingSidebar={webOnStartResizingSidebar}
        onChangeWorkspace={onChangeWorkspace}
        onCreateArea={onCreateArea}
        onOpenOrCloseWorkspaceDropdown={onOpenOrCloseWorkspaceDropdown}
        onEnableOrDisableFloating={props.onEnableOrDisableFloating}
        openedWorkspacesIds={openedWorkspacesIds}
        isFloating={props.isFloating}
        isOpen={props.isOpen}
        onPreventSidebarCollapse={props.onPreventSidebarCollapse}
        />
    )
}
