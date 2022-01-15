import { useEffect, useRef, useContext } from 'react'
import axios from 'axios'
import managementAppAgent from '../../agent'
import { FormularyContext } from '../../contexts'
import Layouts from './layouts'

export default function Formulary(props) {
    const sourceRef = useRef()
    const { state: { formulary }, setFormulary, retrieveFromPersist } = useContext(FormularyContext)

    useEffect(() => {
        sourceRef.current = axios.CancelToken.source()
        return () => {
            if (sourceRef.current) {
                sourceRef.current.cancel()
            }
        }
    }, [])  

    useEffect(() => {
        const isAppDefined = ![null, undefined].includes(props.app)
        const isWorkspaceUUIDDefined = ![null, undefined].includes(props.workspaceUUID)

        if (isAppDefined && isWorkspaceUUIDDefined) {
            managementAppAgent.getFormulary(sourceRef.current, props.workspaceUUID, props.app.uuid).then(response => {
                if (response && response.status === 200) {
                    if (response.data.data !== null) {
                        setFormulary(props.app.uuid, response.data.data)
                    }
                } else {
                    retrieveFromPersist(props.app.uuid)
                }
            }).catch(e => {
                retrieveFromPersist(props.app.uuid)
            })
        }
    }, [props.workspaceUUID, props.app]) 

    return process.env['APP'] === 'web' ? (
        <Layouts.Web
        app={props.app}
        formulary={formulary}
        />
    ) : (
        <Layouts.Mobile/>
    )
}