import { useState, useEffect, useRef, useContext } from 'react'
import { HomeDefaultsContext, AreaContext } from '../../contexts'
import { delay } from '../../../../../shared/utils'
import Layouts from './layouts'

const defaultDelay = delay(1000)

export default function Home(props) {
    const isMountedRef = useRef(false)
    const { areas, setAreas } = useContext(AreaContext)
    const { state: { selectedApp: selectedAppUUID }, setSelectedApp } = useContext(HomeDefaultsContext)
    const [selectedArea, setSelectedArea] = useState({
        uuid: null,
        description: "",
        color: null,
        labelName: "No Area Selected",
        name: "",
        order: 0,
        subAreas: [],
        apps: [],
    })
    const [isEditingArea, setIsEditingArea] = useState(false)
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
     */
    function onChangeAreaNameOrColor({newName=null, newColor=null} = {}) {
        const newData = {
            ...selectedArea,
            labelName: newName !== null ? newName : selectedArea.labelName,
            color: newColor !== null ? newColor : selectedArea.color,
        }
        setSelectedArea(newData)
        /**
         * This is kinda complicated but it will update the area by reference. Every object in memory exists in the heap
         * we will always pass them by reference. This means that when we do `foundArea.labelName = newName` we are changing
         * the value of the actual object in memory.
         * 
         * We add this in a delay because obviously recursively traversing the areas is kinda costly so we will only edit it
         * when we are sure that the user has stopped typing.
         */
        defaultDelay(() => {
            const foundCallback = (area) => area.apps && area.apps.map(app => app.uuid).includes(selectedAppUUID)
            const foundArea = recursiveTraverseAreas(areas, foundCallback)
            if (foundArea) {
                if (newName !== null) foundArea.labelName = newName
                if (newColor !== null) foundArea.color = newColor
                setAreas(areas)
            }
        })
    }

    /**
     * This will recursively traverse all of the areas of the application and return the area when a certain condition is satisfied.
     * 
     * The condition is a callback that we send, it is a function we recieve and that we call passing only the area.
     * 
     * @param {Array<{
     *  uuid: string, 
     *  description: string, 
     *  color: string | null,
     *  labelName: string,
     *  name: string,
     *  order: number,
     *  subAreas: Array<object>,
     *  apps: Array<{}>
     * }} areas - An array with all of the areas of the application.
     * @param {(area: object) => boolean} condition - The condition that we will check if the area satisfies so we return the area object.
     * 
     * @returns {{
     *  uuid: string, 
     *  description: string, 
     *  color: string | null,
     *  labelName: string,
     *  name: string,
     *  order: number,
     *  subAreas: Array<object>,
     *  apps: Array<{}>
     * }} - Returns the area found that satisfies the condition specified.
     */
    function recursiveTraverseAreas(areas, foundCallback) {
        function traverse(areas) {
            for (const area of areas) {
                if (foundCallback(area)) {
                    return area
                } else if (area.subAreas && area.subAreas.length > 0) {
                    const result = traverse(area.subAreas)
                    if (result !== null) {
                        return result
                    }
                }
            }
            return null
        }
        return traverse(areas)
    }

    useEffect(() => {
        isMountedRef.current = true
        window.addEventListener('resize', onResizeWindow)
        return () => {
            isMountedRef.current = false
            window.removeEventListener('resize', onResizeWindow)
        }
    }, [])

    /**
     * This will transverse the tree like structure to get the first app we encounter as the selected app of the user.
     * We will only transverse if there is something in the `areas` array and if the selected area or selectedApp is null.
     */
    useEffect(() => {
        if (areas && areas.length > 0 && selectedAppUUID === null) {
            const foundCallback = (area) => area.apps && area.length > 0
            const foundArea = recursiveTraverseAreas(areas, foundCallback)
            if (foundArea !== null) {
                setSelectedApp(foundArea.apps[0].uuid)
                setSelectedArea({...foundArea})
            }
        }
    }, [areas])
    
    useEffect(() => {
        if (areas && areas.length > 0 && selectedAppUUID !== null && selectedArea.uuid === null) {
            const foundCallback = (area) => area.apps && area.apps.map(app => app.uuid).includes(selectedAppUUID)
            const foundArea = recursiveTraverseAreas(areas, foundCallback)
            if (foundArea !== null) {
                setSelectedArea({...foundArea})
            }
        }
    }, [areas, selectedAppUUID])
        
    return process.env['APP'] === 'web' ? (
        <Layouts.Web
        onResize={onResize}
        onChangeAreaNameOrColor={onChangeAreaNameOrColor}
        setIsEditingArea={setIsEditingArea}
        isEditingArea={isEditingArea}
        isResizing={isResizing}
        selectedArea={selectedArea}
        selectedAppUUID={selectedAppUUID}
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