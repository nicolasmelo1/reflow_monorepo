import { Fragment } from 'react'
import Styled from '../styles'
import SidebarDropdown from '../../Sidebar.Dropdown'
import { strings } from '../../../../core/utils/constants'
import { 
    faChevronDown, faChevronLeft, faSearch, faHistory, faCog
} from '@fortawesome/free-solid-svg-icons'

function SidebarWebLayout(props) {
    return (
        <Styled.Container
        onMouseOver={() => props.onPreventSidebarCollapse(true)}
        onMouseLeave={() => props.onPreventSidebarCollapse(false)}
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
                                    <span>
                                        {strings('sidebarHelloName')}
                                    </span>
                                    <Styled.UserNameText>
                                        {`${props.user.firstName} ${props.user.lastName}`}
                                    </Styled.UserNameText>
                                </Styled.UserHelloAndNameText>
                                <Styled.UserEmailText>
                                    {props.user.username}
                                </Styled.UserEmailText>
                            </Styled.UserNameContainer>
                            <Styled.UserDropdownButton>
                                <Styled.UserDropdownButtonIcon icon={faChevronDown}/>
                            </Styled.UserDropdownButton>
                        </Styled.UserInfoContainer>
                        {props.isFloating ? '' : (
                            <Styled.CloseSidebarButton
                            onClick={(e) => props.onEnableOrDisableFloating()}
                            >
                                {props.isFloating ? '' : (
                                    <Fragment>
                                        <Styled.CloseSidebarButtonIcon icon={faChevronLeft}/>
                                        <Styled.CloseSidebarButtonIcon icon={faChevronLeft}/>
                                    </Fragment>
                                )}
                            </Styled.CloseSidebarButton>
                        )}
                    </Styled.UserInfoAndCloseSidebarButtonContainer>
                    <Styled.NavigationButton>
                        <Styled.NavigationButtonIcon icon={faSearch}/>
                        <Styled.NavigationButtonText>
                            {strings('sidebarQuickSearchButtonLabel')}
                        </Styled.NavigationButtonText>
                    </Styled.NavigationButton>
                    <Styled.NavigationButton>
                        <Styled.NavigationButtonIcon icon={faHistory}/>
                        <Styled.NavigationButtonText>
                            {strings('sidebarHistoryButtonLabel')}
                        </Styled.NavigationButtonText>
                    </Styled.NavigationButton>
                    <Styled.NavigationButton>
                        <Styled.NavigationButtonIcon icon={faCog}/>
                        <Styled.NavigationButtonText>
                            {strings('sidebarSettingsButtonLabel')}
                        </Styled.NavigationButtonText>
                    </Styled.NavigationButton>
                </Styled.TopItemsContainer>
                <Styled.AppsContainer>
                    <Styled.WorkspacesHeadingTitle>
                        {strings('sidebarWorkspacesTitle')}
                    </Styled.WorkspacesHeadingTitle>
                    <Styled.AppsAndAreasList
                    isFloating={props.isFloating}
                    >
                        {props.workspaces.map(workspace => (
                            <SidebarDropdown
                            key={workspace.uuid}
                            workspace={workspace}
                            onChangeWorkspace={props.onChangeWorkspace}
                            editingAreaOrAppUUID={props.editingAreaOrAppUUID}
                            setEditingAreaOrAppUUID={props.setEditingAreaOrAppUUID}
                            />
                        ))}
                    </Styled.AppsAndAreasList>
                </Styled.AppsContainer>
                <Styled.CreateNewWorkspaceButton
                ref={props.addWorkspaceButtonRef}
                onClick={() => props.onCreateArea()}
                >
                    {strings('sidebarCreateNewWorkspaceButtonLabel')}
                </Styled.CreateNewWorkspaceButton>
            </Styled.Wrapper>
            <Styled.SidebarWidth
            onMouseDown={(e) => props.webOnStartResizingSidebar()}
            />
        </Styled.Container>
    )
}

export default SidebarWebLayout