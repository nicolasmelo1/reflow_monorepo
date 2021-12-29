import { Fragment } from 'react'
import Styled from '../styles'
import { strings } from '../../../../core/utils/constants'

function SidebarWebLayout(props) {
    /**
     * Since workspaces can be recursive we need to render all of the workspaces on a separate function.
     */
    function renderWorkspace(workspace, nestingLevel=0) {
        const isWorkspaceOpen = props.openedWorkspacesIds.includes(workspace.uuid)
        return (
            <Styled.WorkspaceContainer key={workspace.uuid}>
                <Styled.WorkspaceDropdownButton
                nestingLevel={nestingLevel}
                onClick={(e) => props.onOpenOrCloseWorkspaceDropdown(workspace.uuid)}
                >
                    <div style={{ width: '20px'}}>
                        <Styled.WorkspaceDropdownButtonIcon 
                        icon={isWorkspaceOpen ? 'chevron-down' : 'chevron-right'}
                        />
                    </div>
                    <Styled.WorkspaceDropdownButtonText>
                        {workspace.labelName}
                    </Styled.WorkspaceDropdownButtonText>
                </Styled.WorkspaceDropdownButton>
                {isWorkspaceOpen ? (
                    <Styled.WorkspaceAppsContainer>
                        {workspace.subAreas.map(subArea => renderWorkspace(subArea, nestingLevel + 1))}
                        {workspace.apps.map(app => (
                            <Styled.AppButton
                            key={app.uuid}
                            nestingLevel={nestingLevel + 1}
                            >   
                                {'•'}
                                <Styled.AppButtonText>
                                    {app.labelName}
                                </Styled.AppButtonText>
                            </Styled.AppButton>
                        ))} 
                    </Styled.WorkspaceAppsContainer>
                ): ''}
            </Styled.WorkspaceContainer>
        )
    }


    return (
        <Styled.Container
        onMouseOver={() => props.onPreventSidebarCollapse(true)}
        onMouseOut={() => props.onPreventSidebarCollapse(false)}
        isFloating={props.isFloating}
        isOpen={props.isOpen}
        sidebarWidth={props.sidebarWidth}
        isResizing={props.isResizing}
        >
            <Styled.Wrapper>
                <Styled.TopItemsContainer>
                    <Styled.UserInfoAndCloseSidebarButtonContainer>
                        <Styled.UserInfoContainer>
                            {/* This is the image of the user */}
                            <div
                            style={{
                                backgroundColor: 'black',
                                height: '20px',
                                width: '20px'
                            }}
                            />
                            {/* This is the image of the user */}
                            <Styled.UserNameContainer>
                                <Styled.UserHelloAndNameText>
                                    <span>{strings('pt-BR', 'sidebarHelloName')}</span>
                                    <Styled.UserNameText>
                                        {`${props.user.firstName} ${props.user.lastName}`}
                                    </Styled.UserNameText>
                                </Styled.UserHelloAndNameText>
                                <Styled.UserEmailText>
                                    {props.user.username}
                                </Styled.UserEmailText>
                            </Styled.UserNameContainer>
                            <Styled.UserDropdownButton>
                                <Styled.UserDropdownButtonIcon icon={'chevron-down'}/>
                            </Styled.UserDropdownButton>
                        </Styled.UserInfoContainer>
                        {props.isFloating ? '' : (
                            <Styled.CloseSidebarButton
                            onClick={(e) => props.onEnableOrDisableFloating()}
                            >
                                {props.isFloating ? '' : (
                                    <Fragment>
                                        <Styled.CloseSidebarButtonIcon icon={'chevron-left'}/>
                                        <Styled.CloseSidebarButtonIcon icon={'chevron-left'}/>
                                    </Fragment>
                                )}
                            </Styled.CloseSidebarButton>
                        )}
                    </Styled.UserInfoAndCloseSidebarButtonContainer>
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
                    {props.workspaces.map(workspace => renderWorkspace(workspace))}
                </Styled.AppsContainer>
            </Styled.Wrapper>
            <Styled.SidebarWidth
            onMouseDown={(e) => props.onStartResizingSidebar()}
            />
        </Styled.Container>
    )
}

export default SidebarWebLayout