import { useEffect, useState, useContext, useRef } from 'react'
import axios from 'axios'
import { WorkspaceContext } from '../../../authentication/contexts'
import { AppManagementTypesContext } from '../../contexts'
import appManagementAgent from '../../agent'
import Layout from './layouts'

export default function ManagementApp(props) {
    const sourceRef = useRef()
    const { state: { selectedWorkspace }} = useContext(WorkspaceContext)
    const { setTypes, retrieveFromPersist } = useContext(AppManagementTypesContext)
    const [isFormularyOpen, setIsFormularyOpen] = useState(false)
    
    function onOpenFormulary(isOpen=null) {
        if (isOpen !== null) {
            setIsFormularyOpen(isOpen)
        } else {
            setIsFormularyOpen(!isFormularyOpen)
        }
    }

    /**
     * This will generate a token for our get requests. The so if the component is unmounted before the request is finished
     * then we will cancel the requests preserving computer resources.
     */
    useEffect(() => {
        sourceRef.current = axios.CancelToken.source()
        return () => {
            if (sourceRef.current) {
                sourceRef.current.cancel()
            }
        }
    }, [])

    /**
     * This is similar to all of the other requests. We will try to retrieve the types (types are obligatory data that we need in order for the application
     * to work) If we can't retrieve them then we will load from the persist storage. In other words, we will retrieve the data from the cache.
     * 
     * If we do not set the types. Then we will not be able to build this applications, this is the first thing that is needed here.
     */
    useEffect(() => {
        if (selectedWorkspace.uuid !== null && props.app?.uuid) {
            appManagementAgent.getFormularyTypes(sourceRef.current, selectedWorkspace.uuid, props.app.uuid).then(response => {
                if (response && response.status === 200) {
                    setTypes(
                        response.data.data.numberFormatType, 
                        response.data.data.dateFormatType, 
                        response.data.data.timeFormatType, 
                        response.data.data.fieldType
                    )
                } else {
                    retrieveFromPersist()
                }
            }).catch(e => {
                retrieveFromPersist()
            })
        }
    }, [selectedWorkspace, props.app])

    return (
        <Layout
        workspace={selectedWorkspace}
        app={props.app}
        isFormularyOpen={isFormularyOpen}
        onOpenFormulary={onOpenFormulary}
        />
    )
}