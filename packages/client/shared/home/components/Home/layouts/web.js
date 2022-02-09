import Styled from '../styles'
import Sidebar from '../../Sidebar'
import App from '../../App'
import { colors, strings } from '../../../../core/utils/constants'
import { faChevronRight, faBars, faTimes, faChevronDown, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'

export default function HomeWebLayout(props) {
    const isNoAreaSelected = props.selectedArea.uuid === null
    const isNonUniqueAreaName = props.nonUniqueAreaUUIDs.includes(props.selectedArea.uuid)

    return (
        <Styled.Container
        onMouseMove={(e) => props.onMouseMoveOpenSidebar(e)}
        >
            <Sidebar
            onChangeArea={props.onChangeArea}
            selectedAreaUUID={props.selectedArea.uuid}
            webOnResizeSidebar={props.webOnResize}
            onEnableOrDisableFloating={props.onEnableOrDisableFloatingSidebar}
            isFloating={props.isFloatingSidebar}
            isOpen={props.isOpenSidebar}
            onPreventSidebarCollapse={props.onPreventSidebarCollapse}
            />
            <Styled.ContentContainer
            isResizing={props.isResizing}
            isFloating={props.isFloatingSidebar}
            isOpen={props.isOpenSidebar}
            >
                <Styled.TopContainer
                color={props.selectedArea.color}
                >
                    <Styled.WorkpsaceEditButton
                    ref={props.areaDropdownEditButtonRef}
                    isNoAreaSelected={isNoAreaSelected}
                    onClick={(e) => {
                        if (isNoAreaSelected === false) {
                            e.stopPropagation()
                            props.setIsEditingArea(!props.isEditingArea)
                        }
                    }}
                    >
                        <Styled.WorkspaceTitle
                        isInvalid={isNonUniqueAreaName}
                        backgroundColor={props.selectedArea.color}
                        >
                            {props.selectedArea.labelName}
                        </Styled.WorkspaceTitle>
                        {isNoAreaSelected === false ? (
                            <Styled.WorkspaceEditDropdownIcon 
                            backgroundColor={props.selectedArea.color}
                            isNonUniqueAreaName={isNonUniqueAreaName}
                            icon={faChevronDown}
                            />
                        ) : ''}
                    </Styled.WorkpsaceEditButton>
                    {props.isEditingArea ? (
                        <Styled.WorkspaceEditDropdownWrapper>
                            <Styled.WorkspaceEditDropdownContainer
                            ref={props.areaDropdownEditMenuRef}
                            >
                                <Styled.WorkspaceEditInput 
                                type={'text'} 
                                autoFocus={true}
                                isInvalid={isNonUniqueAreaName}
                                value={props.selectedArea.labelName} 
                                onChange={(e) => props.onChangeAreaNameOrColor({ newName: e.target.value })}
                                />
                                {isNonUniqueAreaName ? (
                                    <small
                                    style={{
                                        color: 'red'
                                    }}
                                    >
                                        {strings('workspaceNotUniqueErrorMessage')}
                                    </small>
                                ): ''}
                                <p>
                                    {strings('workspaceEditColor')}
                                </p>
                                <Styled.WorkspaceEditColorSelectionContainer>
                                    {colors.map(color => (
                                        <Styled.WorkspaceEditColorSelection
                                        key={color}
                                        >
                                            <Styled.WorkspaceEditColorButton
                                            color={color}
                                            onClick={() => props.onChangeAreaNameOrColor({ newColor: color })}
                                            />
                                        </Styled.WorkspaceEditColorSelection>
                                    ))}
                                </Styled.WorkspaceEditColorSelectionContainer>
                                <Styled.WorkspaceRemoveContainer>
                                    <Styled.RemoveWorkspaceButton
                                    onClick={(e) => props.onRemoveArea(props.selectedArea.uuid)}
                                    >
                                        <Styled.RemoveWorkspaceButtonIcon icon={faTrash}/>
                                        {strings('workspaceRemoveButtonLabel')}
                                    </Styled.RemoveWorkspaceButton>
                                </Styled.WorkspaceRemoveContainer>
                            </Styled.WorkspaceEditDropdownContainer>
                        </Styled.WorkspaceEditDropdownWrapper>
                    ) : ''}
                    <Styled.AppsContainer>
                        {props.isFloatingSidebar ? (
                            <Styled.SidebarButton
                            backgroundColor={props.selectedArea.color}
                            onClick={() => props.onEnableOrDisableFloatingSidebar()}
                            >
                                <Styled.SidebarButtonIcon icon={faChevronRight}/>
                                <Styled.SidebarButtonIcon icon={faChevronRight}/>
                            </Styled.SidebarButton>
                        ) : (
                            <Styled.SidebarButton
                            backgroundColor={props.selectedArea.color}
                            onClick={() => props.setIsOpenSidebar(!props.isOpenSidebar)}
                            >
                                <Styled.SidebarButtonIcon icon={faBars}/>
                            </Styled.SidebarButton>
                        )}
                        <Styled.AppsScroller>
                            {props.selectedArea.apps.map(app => (
                                <Styled.AppsButton
                                key={app.uuid}
                                isSelected={app.uuid === props.selectedApp.uuid}
                                onClick={() => props.setSelectedApp(app)}
                                >
                                    <Styled.AppsText>
                                        {app.labelName}
                                    </Styled.AppsText>
                                    <Styled.AppsRemoveButton>
                                        <Styled.AppsRemoveIcon icon={faTimes}/>
                                    </Styled.AppsRemoveButton>
                                </Styled.AppsButton>
                            ))}
                            <Styled.AddNewAppButton>
                                {strings('workspaceAddNewAppButtonLabel')}
                                <Styled.AddNewAppButtonIcon icon={faPlus}/>
                            </Styled.AddNewAppButton>
                        </Styled.AppsScroller>
                    </Styled.AppsContainer>
                </Styled.TopContainer>
                <App
                isSidebarFloating={props.isFloatingSidebar}
                isSidebarOpen={props.isOpenSidebar}
                />
            </Styled.ContentContainer>
        </Styled.Container>
    )
}