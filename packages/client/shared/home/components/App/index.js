import { useEffect, useContext } from 'react'
import { UserContext } from '../../../authentication/contexts'
import { AppContext, HomeDefaultsContext } from '../../contexts'
import homeAgent from '../../agent'
import Layouts from './layout'

export default function App(props) {
    const { state: { app }, setApp, retrieveFromPersist } = useContext(AppContext)
    const { user } = useContext(UserContext)
    const { state: { selectedApp: selectedAppUUID, selectedArea }} = useContext(HomeDefaultsContext)
    
    /**
     * This will retrieve the app data from the backend and store it in the state. If we can't retrieve the app data then we will try
     * to retrieve this data from the localstorage if it exists. The idea here is that this will load all of the data needed for us to be able
     * to load the app. We need to know what type of app it is.
     */
    useEffect(() => {
        if (user.workspaces.length > 0 && selectedAppUUID !== null && selectedArea.uuid !== null) {         
            homeAgent.getApp(user.workspaces[0].uuid, selectedArea.uuid, selectedAppUUID).then(response => {
                if (response && response.status === 200) {
                    setApp(response.data.data)
                } else {
                    retrieveFromPersist(selectedAppUUID)
                }
            }).catch(e => {
                retrieveFromPersist(selectedAppUUID)
            })
        }
    }, [selectedArea.uuid, selectedAppUUID])

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