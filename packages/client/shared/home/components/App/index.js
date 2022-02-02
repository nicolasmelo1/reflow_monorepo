import { useEffect, useContext } from 'react'
import { WorkspaceContext } from '../../../authentication/contexts'
import { AppContext, HomeDefaultsContext } from '../../contexts'
import homeAgent from '../../agent'
import Layouts from './layout'

export default function App(props) {
    const { state: { app }, setApp, retrieveFromPersist } = useContext(AppContext)
    const { state: { selectedWorkspace } } = useContext(WorkspaceContext)
    const { state: { selectedApp, selectedArea }} = useContext(HomeDefaultsContext)
    
    /**
     * This will retrieve the app data from the backend and store it in the state. If we can't retrieve the app data then we will try
     * to retrieve this data from the localstorage if it exists. The idea here is that this will load all of the data needed for us to be able
     * to load the app. We need to know what type of app it is.
     */
    useEffect(() => {
        if (selectedWorkspace.uuid !== null && selectedApp.uuid !== null && selectedArea.uuid !== null) {         
            homeAgent.getApp(selectedWorkspace.uuid, selectedArea.uuid, selectedApp.uuid).then(response => {
                if (response && response.status === 200) {
                    setApp(response.data.data)
                } else {
                    retrieveFromPersist(selectedApp.uuid)
                }
            }).catch(e => {
                retrieveFromPersist(selectedApp.uuid)
            })
        }
    }, [selectedArea.uuid, selectedApp.uuid])

    return process.env['APP'] === 'web' ? (
        <Layouts.Web
        app={app}
        isSidebarFloating={props.isSidebarFloating}
        isSidebarOpen={props.isSidebarOpen}
        />
    ) : (
        <Layouts.Mobile/>
    )
}