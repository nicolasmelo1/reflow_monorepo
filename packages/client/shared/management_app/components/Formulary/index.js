import { useEffect } from 'react'
import managementAppAgent from '../../agent'
import { FormularyContext } from '../../contexts'
import Layouts from './layouts'

export default function Formulary(props) {
    const sourceRef = useRef()
    const { setFormulary, retrieveFromPersist } = useContext(FormularyContext)

    useEffect(() => {
        sourceRef.current = axios.CancelToken.source()
        return () => {
            if (sourceRef.current) {
                sourceRef.current.cancel()
            }
        }
    }, [])  

    useEffect(() => {
        const isWorkspaceUUIDDefined = ![null, undefined].includes(props.workspaceUUID)
        const isAppUUIDDefined = ![null, undefined].includes(props.appUUID)

        if (isAppUUIDDefined && isWorkspaceUUIDDefined) {
            managementAppAgent.getFormulary(sourceRef.current, props.workspaceUUID, props.appUUID).then(response => {
                if (response && response.status === 200) {
                    setFormulary(props.appUUID, response.data.data)
                } else {
                    retrieveFromPersist(props.appUUID)
                }
            }).catch(e => {
                retrieveFromPersist(props.appUUID)
            })
        }
    }, [props.workspaceUUID, props.appUUID]) 

    return process.env['APP'] === 'web' ? (
        <Layouts.Web/>
    ) : (
        <Layouts.Mobile/>
    )
}