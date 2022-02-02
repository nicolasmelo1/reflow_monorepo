import { useState, useEffect, useRef, useContext } from 'react'
import { HomeDefaultsContext, AreaContext, HomeContext } from '../../contexts'
import { WorkspaceContext } from '../../../authentication/contexts'
import { delay } from '../../../../../shared/utils'
import Layouts from './layouts'
import { useClickedOrPressedOutside, useRouterOrNavigationRedirect } from '../../../core/hooks'
import homeAgent from '../../agent'
import { paths } from '../../../core/utils/constants'

const defaultDelay = delay(1000)

export default function Home(props) {
    const isMountedRef = useRef(false)
    const areaDropdownEditMenuRef = useRef()
    const areaDropdownEditButtonRef = useRef()
    const redirect = useRouterOrNavigationRedirect()
    const { state: { selectedWorkspace }} = useContext(WorkspaceContext)
    const { state: { isEditingArea }, setIsEditingArea } = useContext(HomeContext)
    const { state: { areas, nonUniqueAreaUUIDs }, setAreas, recursiveTraverseAreas } = useContext(AreaContext)
    const { 
        state: { selectedApp , selectedArea }, 
        setSelectedApp, 
        setSelectedArea, 
        setState: setSelectedAreaAndApp,
        retrieveFromPersist
    } = useContext(HomeDefaultsContext)
    useClickedOrPressedOutside({ ref: areaDropdownEditMenuRef, callback: clickOutsideToClose})
    const [isResizing, setIsResizing] = useState(false)
    const [isFloatingSidebar, setIsFloatingSidebar] = useState(false)
    const [isOpenSidebar, setIsOpenSidebar] = useState(true)
    const [isToPreventSidebarCollapse, setIsToPreventSidebarCollapse] = useState(false)
    const [isRemovingArea, setIsRemovingArea] = useState(false)

    /**
     * This is kinda complicated but it will update the area by reference. Every object in memory exists in the heap
     * we will always pass them by reference. This means that when we do `foundArea.labelName = newName` we are changing
     * the value of the actual object in memory. This means, foundArea is the SAME object from the `areas` array so when we 
     * change it's value we are changing the value of the object in the `areas` array.
     * 
     * We add this in a delay because obviously recursively traversing the areas is kinda costly so we will only edit it
     * when we are sure that the user has stopped typing.
     * 
     * Besides traversing the list of areas what we do is update the state in the backend with the new area data.
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
     * }} newAreaData - This is the new data of the area that you want to update in the areas array.
     */
    function submitAreaChanges(newAreaData) {
        defaultDelay(async () => {
            const foundCallback = (area) => area.uuid === newAreaData.uuid
            const foundArea = await recursiveTraverseAreas(foundCallback, areas)
            if (foundArea) {
                foundArea.labelName = newAreaData.labelName
                foundArea.color = newAreaData.color
                setAreas([...areas]).then(({nonUniqueAreaUUIDs}) => {
                    if (!nonUniqueAreaUUIDs.includes(newAreaData.uuid) && selectedWorkspace.uuid !== null) {
                        homeAgent.updateArea(selectedWorkspace.uuid, newAreaData.uuid, newAreaData)
                    }
                })
            }
        })
    }

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
    function onPreventSidebarCollapse(preventSidebarCollapse) {
        if (process.env['APP'] === 'web') {
            if (isToPreventSidebarCollapse !== preventSidebarCollapse) {
                setIsToPreventSidebarCollapse(preventSidebarCollapse)
            }
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
     * 
     * @param {boolean} isResizing - This is a boolean that will tell if the sidebar is being resized or not.
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

    /**
     * We can change the name or the color of the selected area. That's exaclty what this function handles, for both cases, if the user
     * changes the name or the color of the area. You will see that we delay the execution to change stuff in the sidebar. Because when we do that
     * we need to transverse the hole structure of the areas.
     * 
     * @param {object} changeParameters - This is an object that contains the name and the color of the area.
     * @param {string | null} [changeParameters.name=null] - This is the new name of the area.
     * @param {string | null} [changeParameters.color=null] - This is the new color of the area.
     */
    function onChangeAreaNameOrColor({newName=null, newColor=null} = {}) {
        const newData = {
            ...selectedArea,
            labelName: newName !== null ? newName : selectedArea.labelName,
            color: newColor !== null ? newColor : selectedArea.color,
        }
        setSelectedArea(newData)
        submitAreaChanges(newData)
    }

    /**
     * You might ask yourself, why don't we just use `setAreas` here? Because we need to keep an hierarchy of things.
     * The sidebar will control all the changes inside it, it's not dependant on any upper component on the component chain.
     * 
     * This means that when a change is made IN the sidebar the sidebar will be able to control itself. We will only notify the
     * parent component that a change had been made so we can update the state of the parent component.
     * 
     * This keeps the code consistent and the API simple to use and maintain.
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
     * }} newAreaData - This is the new data for the area.
     */
    function onChangeArea(newAreaData) {
        if (newAreaData.uuid === selectedArea.uuid) {
            setSelectedArea(newAreaData)
        }
    }

    /**
     * This function will remove the areas from the areas array.
     * 
     * We do this by transversing the areas array and removing the area that has the same uuid as the one that we want to remove.
     * In other words, what we do is that we create a new array of areas if by appending all the areas that are not the one we want to remove.
     * After removing the area we select by the default the first area and app that we encounter.
     * 
     * @param {string} areaUUID - the uuid of the area that we want to remove.
     */
    function onRemoveArea(areaUUID) {
        if (selectedWorkspace.uuid !== null) {
            const traverseAndRemove = (areas) => {
                let newAreas = []
                let order = 0
                for (const area of areas) {
                    if (area.subAreas && area.subAreas.length > 0) {
                        area.subAreas = traverseAndRemove(area.subAreas)
                    }
                    if (area.uuid !== areaUUID) {
                        area.order = order
                        newAreas.push(area)
                    } 
                    order++
                }
                return newAreas
            }

            if (isRemovingArea === false) {
                setIsRemovingArea(true)
                homeAgent.removeArea(selectedWorkspace.uuid, areaUUID).then(response => {
                    if (response && response.status === 200) {
                        const newAreas = traverseAndRemove(areas)
                        setAreas(newAreas)
                        findFirstAreaAndAppAndSetDefault()
                    }
                    setIsRemovingArea(false)
                }).catch(e => {
                    setIsRemovingArea(false)
                })
            } 
        }
    }

    /**
     * This will automatically find the first area and app of the `areas` tree. This is used to set the initial state of the sidebar.
     * obviously, if no area or app is found, the defaults will be empty.
     * 
     * It will traverse the areas and apps tree and try to find the first app that satisfies the condition.
     */
    async function findFirstAreaAndAppAndSetDefault() {
        const foundCallback = (area) => area.apps && area.apps.length > 0
        const foundArea = await recursiveTraverseAreas(foundCallback, areas)
        if (foundArea !== null) {
            redirect(paths.app.asUrl.replace('{workspaceUUID}', foundArea.uuid).replace('{appUUID}', foundArea.apps[0].uuid))
            setIsEditingArea(false)
        }
    }

    /**
     * This function will select the area based on an appUUID. If the area is found and the app and the area are the same as the `props.workspaceUUID` and `props.appUUID`
     * we will just set the selectedAreaAndApp. Otherwise we will redirect to the right workspace and app uuids.
     * 
     * The idea here is simple, we want to keep the state always correct, the url also holds the state for the content we are seeing at the current time.
     * 
     * So the idea is that when we select an app we want to redirect the user to the exact workspaceUUID of the given appUUID..
     * 
     * If no area is found for the given uuid, we just select the first area and app.
     * 
     * @param {string} appUUID - This is the uuid of the app we want to select.
     */
    async function selectAreaBasedOnAppUUID(appUUID) {
        function foundCallback(area) {
            return area.apps && area.apps.map(app => app.uuid).includes(appUUID)
        }

        recursiveTraverseAreas(foundCallback, areas).then(foundArea => {
            if (foundArea !== null) {
                if (props.workspaceUUID !== foundArea.uuid || props.appUUID !== appUUID) {
                    setIsEditingArea(false)
                    redirect(paths.app.asUrl.replace('{workspaceUUID}', foundArea.uuid).replace('{appUUID}', appUUID))
                } else {
                    const appData = foundArea.apps.find(app => app.uuid === appUUID)
                    if (appData !== undefined) setSelectedAreaAndApp(appData, foundArea)
                }
            } else {
                findFirstAreaAndAppAndSetDefault()
            }
        })
    }

    /**
     * / * WEB ONLY * /
     * 
     * Function called when the user clicks outside of the dropdown menu.
     * 
     * @param {React.SyntheticEvent} event - The event that triggered the function.
     */
    function clickOutsideToClose(e) {
        if(areaDropdownEditButtonRef.current !== null && !areaDropdownEditButtonRef.current.contains(e.target)) {
            setIsEditingArea(false)
        }
    }

    useEffect(() => {
        isMountedRef.current = true
        if (process.env['APP'] === 'web') window.addEventListener('resize', onResizeWindow)
        return () => {
            isMountedRef.current = false
            if (process.env['APP'] === 'web') window.removeEventListener('resize', onResizeWindow)
        }
    }, [])
    
    /**
     * This will change the state accordingly depending of the url we are in. By default we change the page to the
     * exact `props.appUUID` and the `props.workspaceUUID`. If one of them is not defined then we will retrieve the
     * first app of the first area. If just the area/workspace is defined we will retrieve the first app of it. If it has no app
     * we retrieve the initial state of the selected app. Last but not least, if the area does not exist anymore we will retrieve the first area
     * and app.
     * 
     * The last case is when no area and no app are selected, we will try to retrive the default data from the persist storage, and if we can't find
     * anything we select the first area and app.
     */
    useEffect(() => {
        if (areas && areas.length > 0) {
            if (![null, undefined].includes(props.appUUID)) {
                selectAreaBasedOnAppUUID(props.appUUID)
            } else if (![null, undefined].includes(props.workspaceUUID)) {
                const foundCallback = (area) => area.uuid && area.uuid === props.workspaceUUID
                recursiveTraverseAreas(foundCallback, areas).then(foundArea => {
                    if (foundArea !== null) {
                        // if the area is defined but the app is not we retrieve the first app of the area, otherwise we set the selected app to the 
                        // initial state.
                        if (foundArea.apps && foundArea.apps.length > 0) {
                            const appUUID = foundArea.apps[0].uuid
                            setIsEditingArea(false)
                            redirect(paths.app.asUrl.replace('{workspaceUUID}', props.workspaceUUID).replace('{appUUID}', appUUID))
                        } else {
                            setSelectedAreaAndApp(null, foundArea)
                        }
                    } else {
                        // The area selected does not exist anymore for the user (he lost access or the admin deleted it.)
                        findFirstAreaAndAppAndSetDefault()
                    }
                })
            } else {
                retrieveFromPersist().then(({ selectedArea, selectedApp }) => {
                    const isSelectedAreaUUIDDefined = ![null, undefined].includes(selectedArea?.uuid)
                    const isSelectedAppUUIDDefined = ![null, undefined].includes(selectedApp?.uuid)
                    if (isSelectedAreaUUIDDefined && isSelectedAppUUIDDefined) {
                        redirect(paths.app.asUrl.replace('{workspaceUUID}', props.workspaceUUID).replace('{appUUID}', selectedApp.uuid))
                    } else { 
                        findFirstAreaAndAppAndSetDefault()
                    }
                })
            }
        }
    }, [areas, props.workspaceUUID, props.appUUID])

    return process.env['APP'] === 'web' ? (
        <Layouts.Web
        areaDropdownEditMenuRef={areaDropdownEditMenuRef}
        areaDropdownEditButtonRef={areaDropdownEditButtonRef}
        onResize={onResize}
        onChangeAreaNameOrColor={onChangeAreaNameOrColor}
        nonUniqueAreaUUIDs={nonUniqueAreaUUIDs}
        setIsEditingArea={setIsEditingArea}
        isEditingArea={isEditingArea}
        isResizing={isResizing}
        onChangeArea={onChangeArea}
        onRemoveArea={onRemoveArea}
        selectedArea={selectedArea}
        setSelectedApp={setSelectedApp}
        selectedApp={selectedApp}
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