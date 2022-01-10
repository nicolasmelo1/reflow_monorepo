import ManagementApp from "../../../../management_app/components/ManagementApp"
import Styled from '../styles'

export default function AppWebLayout(props) {
    const selectedAppName = ![null, undefined].includes(props.app) && ![null, undefined].includes(props.app.selectedApp) && 
        ![null, undefined].includes(props.app.selectedApp.name) ? props.app.selectedApp.name : null
    const isBuiltin = ![null, undefined].includes(props.app) && ![null, undefined].includes(props.app.selectedApp) && 
    ![null, undefined].includes(props.app.selectedApp.isBuiltin) ? props.app.selectedApp.isBuiltin : false

    return (
        <Styled.AppLayout
        isSidebarFloating={props.isSidebarFloating}
        isSidebarOpen={props.isSidebarOpen}
        >
            {isBuiltin && selectedAppName === 'reflow_management' ? (
                <ManagementApp
                app={![null, undefined].includes(props.app) ? props.app : {}}
                />
            ) : ''}
        </Styled.AppLayout>
    )
}