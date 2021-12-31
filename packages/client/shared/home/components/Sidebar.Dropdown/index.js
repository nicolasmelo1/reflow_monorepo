import { useState, useEffect, useContext } from 'react'
import { HomeDefaultsContext } from '../../contexts'
import Layouts from './layouts'
import { delay } from '../../../../../shared/utils'

const defaultDelay = delay(1000)

export default function SidebarDropdown(props) {
    let appUUIDByIndexReference = {}
    const { setSelectedApp } = useContext(HomeDefaultsContext)
    const [isOpen, setIsOpen] = useState(false)
    const [isHovering, setIsHovering] = useState(false)
    const [hoveringAppUUID, setHoveringAppUUID] = useState(null)

    function submitAppChanges(appData) {
        defaultDelay(() => {
        })
    }

    function submitAreaChanges(areaData) {
        defaultDelay(() => {
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
        props.workspace.labelName = newName
        submitAreaChanges(props.workspace)
        props.onChangeWorkspace(props.workspace)
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
     * This will change the selected app UUID in the global context. So the `HOME` component can change accordingly the selected app.
     */
    function onSelectAppUUID(appUUID) {
        setSelectedApp(appUUID)
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

    return process.env['APP'] === 'web' ? (
        <Layouts.Web
        isOpen={isOpen}
        isHovering={isHovering}
        setIsHovering={setIsHovering}
        hoveringAppUUID={hoveringAppUUID}
        setHoveringAppUUID={setHoveringAppUUID}
        onToggleAreaOrAppEditing={onToggleAreaOrAppEditing}
        setEditingAreaOrAppUUID={props.setEditingAreaOrAppUUID}
        editingAreaOrAppUUID={props.editingAreaOrAppUUID}
        onSelectAppUUID={onSelectAppUUID}
        onChangeWorkspace={props.onChangeWorkspace}
        onChangeAppName={onChangeAppName}
        onChangeWorkspaceName={onChangeWorkspaceName}
        onToggleDropdown={onToggleDropdown}
        workspace={props.workspace}
        nestingLevel={props.nestingLevel}
        />
    ) : (
        <Layouts.Mobile/>
    )
}