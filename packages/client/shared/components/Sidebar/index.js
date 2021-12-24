import { useState } from 'react'
import Layouts from './layouts'


function Sidebar(props) {
    const workspacesMock = [{
        id: 1,
        labelName: 'Vendas',
        apps: [
            {
                id: 1,
                labelName: 'Gestão',
            },
            {
                id: 2,
                labelName: 'Automação',
            }
        ]
    },{
        id: 2,
        labelName: 'Recursos Humanos',
        apps: [
            {
                id: 3,
                labelName: 'Contratação Designer',
            }
        ]
    }]
    const [openedWorkspacesIds, setOpenedWorspacesIds] = useState([])

    /**
     * This function will open or close a workspace dropdown, that's the hole idea and concept.
     * By recieving a workspace id we can know if the state of the workspace dropdown is either closed or 
     * open by checking if the id is in the `openedWorkspacesIds` state array. If it is, then it's open
     * and we need to close, otherwise it's closed and we need to open.
     * 
     * @param {number} workspaceId - The workspaceId to check if it's closed or open.
     */
    function onOpenOrCloseWorkspaceDropdown(workspaceId) {
        if (openedWorkspacesIds.includes(workspaceId)) {
            setOpenedWorspacesIds([
                ...openedWorkspacesIds.filter(openedWorkspaceId => openedWorkspaceId !== workspaceId)
            ])
        } else {
            openedWorkspacesIds.push(workspaceId)
            setOpenedWorspacesIds([...openedWorkspacesIds])
        }
    }

    return process.env['APP'] === 'web' ? (
        <Layouts.Web
        workspaces={workspacesMock}
        openedWorkspacesIds={openedWorkspacesIds}
        onOpenOrCloseWorkspaceDropdown={onOpenOrCloseWorkspaceDropdown}
        />
    ) : (
        <Layouts.Mobile/>
    )
}


export default Sidebar