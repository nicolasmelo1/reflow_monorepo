import Styled from '../styles'
import { strings } from '../../../utils/constants'

function SidebarWebLayout(props) {
    return (
        <Styled.Container>
            <Styled.TopItemsContainer>
                <Styled.UserInfoContainer>
                    <div
                    style={{
                        backgroundColor: 'black',
                        height: '20px',
                        width: '20px'
                    }}
                    />
                    <Styled.UserNameContainer>
                        <Styled.UserHelloAndNameText>
                            <span>{strings('pt-BR', 'sidebarHelloName')}</span>
                            <Styled.UserNameText>
                                {'Nicolas Leal'}
                            </Styled.UserNameText>
                        </Styled.UserHelloAndNameText>
                        <Styled.UserEmailText>
                            {'nicolas.melo@reflow.com.br'}
                        </Styled.UserEmailText>
                    </Styled.UserNameContainer>
                    <Styled.UserDropdownButton>
                        <Styled.UserDropdownButtonIcon icon={'chevron-down'}/>
                    </Styled.UserDropdownButton>
                </Styled.UserInfoContainer>
                <Styled.NavigationButton>
                    <Styled.NavigationButtonIcon icon={'search'}/>
                    <Styled.NavigationButtonText>
                        {strings('pt-BR', 'sidebarQuickSearchButtonLabel')}
                    </Styled.NavigationButtonText>
                </Styled.NavigationButton>
                <Styled.NavigationButton>
                    <Styled.NavigationButtonIcon icon={'history'}/>
                    <Styled.NavigationButtonText>
                        {strings('pt-BR', 'sidebarHistoryButtonLabel')}
                    </Styled.NavigationButtonText>
                </Styled.NavigationButton>
                <Styled.NavigationButton>
                    <Styled.NavigationButtonIcon icon={'cog'}/>
                    <Styled.NavigationButtonText>
                        {strings('pt-BR', 'sidebarSettingsButtonLabel')}
                    </Styled.NavigationButtonText>
                </Styled.NavigationButton>
            </Styled.TopItemsContainer>
            <Styled.AppsContainer>
                <Styled.WorkspacesHeadingTitle>
                    {'WORKSPACES'}
                </Styled.WorkspacesHeadingTitle>
                {props.workspaces.map(workspace => {
                    const isWorkspaceOpen = props.openedWorkspacesIds.includes(workspace.id)
                    return (
                        <Styled.WorkspaceContainer key={workspace.id}>
                            <Styled.WorkspaceDropdownButton
                            onClick={(e) => props.onOpenOrCloseWorkspaceDropdown(workspace.id)}
                            >
                                <Styled.WorkspaceDropdownButtonIcon icon={isWorkspaceOpen ? 'chevron-down' : 'chevron-right'}/>
                                <Styled.WorkspaceDropdownButtonText>
                                    {workspace.labelName}
                                </Styled.WorkspaceDropdownButtonText>
                            </Styled.WorkspaceDropdownButton>
                            {isWorkspaceOpen ? (
                                <Styled.WorkspaceAppsContainer>
                                    {workspace.apps.map(app => (
                                        <p key={app.id}>
                                            {app.labelName}
                                        </p>
                                    ))} 
                                </Styled.WorkspaceAppsContainer>
                            ): ''}
                        </Styled.WorkspaceContainer>
                    )
                })}
            </Styled.AppsContainer>
        </Styled.Container>
    )
}

export default SidebarWebLayout