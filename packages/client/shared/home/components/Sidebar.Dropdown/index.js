import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../../authentication/contexts'
import { AreaContext, HomeDefaultsContext } from '../../contexts'
import Layouts from './layouts'
import { delay } from '../../../../../shared/utils'
import homeAgent from '../../agent'
import { useRouterOrNavigationRedirect } from '../../../core/hooks'
import { paths } from '../../../core/utils/constants'

const defaultDelay = delay(300)

export default function SidebarDropdown(props) {
    let appUUIDByIndexReference = {}
    const redirect = useRouterOrNavigationRedirect()
    const { user } = useContext(UserContext)
    const [workspace, setWorkspace] = useState(props.workspace)
    const { state: { nonUniqueAreaUUIDs }} = useContext(AreaContext)
    const [isOpen, setIsOpen] = useState(false)
    const [isHovering, setIsHovering] = useState(false)
    const [hoveringAppUUID, setHoveringAppUUID] = useState(null)

    function submitAppChanges(appData) {
        defaultDelay(() => {
        })
    }
    /** 
     * This will submit the changes to 2 places: 
     * - First we will call the parent `onChangeWorkspace` function that will be responsible for calling `setArea` from AreaContext and update the area.
     * - Second we will call the API to update the workspace in the backend.
     * 
     * It's important to notice here that `onChangeWorkspace` returns a promise, this promise is the state of `AreaContext`. For us, this means that we are able to
     * see if the areaUUID is NON UNIQUE. IF it is we unique we will update the state of the area and also we will save this state in the backend. Otherwise, no change
     * will be submited for the backend.
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
     * }} areaData - The new data of the area. THe area was changed, we update the state, but react actually memoizes the state changes,
     * this means that when we call this function the state will be exactly as it was before the update. So we need to pass the new state directly
     * so we can use it.
     */ 
    function submitAreaChanges(areaData) {
        defaultDelay(() => {
            props.onChangeWorkspace(areaData).then(({ nonUniqueAreaUUIDs }) => {
                if (!nonUniqueAreaUUIDs.includes(areaData.uuid)) {
                    homeAgent.updateArea(user.workspaces[0].uuid, areaData.uuid, areaData)
                }
            })
        })
    }

    /**
     * Function used to change the workspace name.
     * When we change the workspace name we call the `Sidebar`'s `onChangeWorkspace` function. To update the
     * tree structure of our workspaces.
     * 
     * The idea is that we update everything by reference here. You see that we are updating the `props.workspace`
     * directly. This means that what we are actually updating is the actual object value we recieve. The props.workspace
     * will always refer to the same object since we are always passing it as reference.
     * 
     * So to prevent us from always looking for the tree like structure of our workspaces we just updates it as reference.
     * When we call `onChangeWorkspace` we just need to make `setAreas(area)` to update the tree structure, no need to traverse
     * everything.
     * 
     * @param {string} newName - The new name of the workspace.
     */
    function onChangeWorkspaceName(newName) {
        workspace.labelName = newName
        props.workspace.labelName = newName
        setWorkspace({...workspace})
        submitAreaChanges({...workspace})
    }

    /**
     * This is used for when the user is changing the app name. Notice that apps are different than areas.
     * 
     * We set on the state the uuid of the app that is being edited. Not a true or false state.
     * 
     * Because of that we cache the index of the appUUID so when we are changing the name we don't need to traverse everytime from the
     * hole list of apps we just traverse the list on the first input, the second input will use the cached index.
     * 
     * @param {string} newName - The new name of the app.
     */
    function onChangeAppName(newName) {
        const editingAppUUID = props.editingAreaOrAppUUID
        if (editingAppUUID !== null) {
            if (appUUIDByIndexReference[editingAppUUID] !== undefined) {
                const index = appUUIDByIndexReference[editingAppUUID]
                props.workspace.apps[index].labelName = newName
                submitAppChanges(props.workspace.apps[index])
                props.onChangeWorkspace(props.workspace)
            } else {
                for (let i=0; i<props.workspace.apps.length; i++) {
                    const app = props.workspace.apps[i]
                    if (editingAppUUID === app.uuid) {
                        appUUIDByIndexReference[app.uuid] = i
                        app.labelName = newName
                        submitAppChanges(app)
                        props.onChangeWorkspace(props.workspace)
                        break
                    }
                }
            }
        }
    }

    /**
     * This will toogle on or off the isEditing state. Is editing is will just enable the user to type the new name
     * of the workspace.
     * 
     * @param {string | null} areaOrAppUUID - If we are editing an area or an app we will pass the uuid of the area or app otherwise
     * we will pass null.
     */
    function onToggleAreaOrAppEditing(areaOrAppUUID=null) {
        props.setEditingAreaOrAppUUID(areaOrAppUUID)
    }
    
    /**
     * This will redirect the user to the specific appUUID and workspaceUUID selected.
     * 
     * @param {string} appUUID - The uuid of the app that is being selected.
     */
    function onSelectAppUUID(appUUID) {
        redirect(paths.app.asUrl.replace('{workspaceUUID}', props.workspace.uuid).replace('{appUUID}', appUUID))
    }

    /**
     * This will redirect the user to the selected area. By default when an area is selected we get right away, the first app of this area. If the area has no apps
     * then we will open directly on the page for the user to create a new app.
     */
    function onSelectArea() {
        if (props.workspace.apps.length > 0) {
            const appUUID = props.workspace.apps[0].uuid
            redirect(paths.app.asUrl.replace('{workspaceUUID}', props.workspace.uuid).replace('{appUUID}', appUUID))
        } else {
            redirect(paths.workspace.asUrl.replace('{workspaceUUID}', props.workspace.uuid))
        }
    }

    /**
     * Has the user opened or closed the dropdown? That's exactly the state that this handles.
     * 
     * When the user opens the dropdown we set the state to `isOpen` to true. When the user closes the dropdown
     * we set the state to `isOpen` to false.
     */
    function onToggleDropdown() {
        if (props.editingAreaOrAppUUID !== props.workspace.uuid) {
            setIsOpen(!isOpen)
        }
    }

    /**
     * When the user clicks outside of the dropdown button we set the `isEditing` state to false.
     */
    function onUserClicksOutsideOfDropdown() {
        onToggleAreaOrAppEditing()
    }
    
    /**
     * On here we DO NOT use the `useClickedOrPressedOutside` hook because we will not pass a ref since this will handle
     * both the areas and the apps. If we use `useClickedOrPressedOutside` hook we need to pass a ref. But the refs will be dynamic
     * since the apps and areas are dynamic, because of that we set this by hand.
     */
    useEffect(() => {
        if (process.env['APP'] === 'web') document.addEventListener('click', onUserClicksOutsideOfDropdown)
        return () => {
            if (process.env['APP'] === 'web') document.removeEventListener('click', onUserClicksOutsideOfDropdown)
        }
    }, [])

    /**
     * We keep on the state the workspace data. So we don't need to rerender everytime the hole sidebar. We are also able
     * to add accents to the workspace name which will not be possible if you change the props.workspace directly.
     */
    useEffect(() => {
        setWorkspace({...props.workspace})
    }, [props.workspace.labelName, props.workspace.color])

    return process.env['APP'] === 'web' ? (
        <Layouts.Web
        isOpen={isOpen}
        isHovering={isHovering}
        nonUniqueAreaUUIDs={nonUniqueAreaUUIDs}
        setIsHovering={setIsHovering}
        hoveringAppUUID={hoveringAppUUID}
        setHoveringAppUUID={setHoveringAppUUID}
        onToggleAreaOrAppEditing={onToggleAreaOrAppEditing}
        setEditingAreaOrAppUUID={props.setEditingAreaOrAppUUID}
        editingAreaOrAppUUID={props.editingAreaOrAppUUID}
        onSelectArea={onSelectArea}
        onSelectAppUUID={onSelectAppUUID}
        onChangeWorkspace={props.onChangeWorkspace}
        onChangeAppName={onChangeAppName}
        onChangeWorkspaceName={onChangeWorkspaceName}
        onToggleDropdown={onToggleDropdown}
        workspace={workspace}
        nestingLevel={props.nestingLevel}
        />
    ) : (
        <Layouts.Mobile/>
    )
}