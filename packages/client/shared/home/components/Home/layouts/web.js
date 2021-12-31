import Styled from '../styles'
import Sidebar from '../../Sidebar'
import { colors, strings } from '../../../../core/utils/constants'
import { faChevronRight, faBars, faTimes, faChevronDown } from '@fortawesome/free-solid-svg-icons'

export default function HomeWebLayout(props) {
    return (
        <Styled.Container
        onMouseMove={(e) => props.onMouseMoveOpenSidebar(e)}
        >
            <Sidebar
            onChangeArea={props.onChangeArea}
            selectedAreaUUID={props.selectedArea.uuid}
            onResizeSidebar={props.onResize}
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
                    onClick={(e) => {
                        e.stopPropagation()
                        props.setIsEditingArea(!props.isEditingArea)
                    }}
                    >
                        <Styled.WorkspaceTitle
                        backgroundColor={props.selectedArea.color}
                        >
                            {props.selectedArea.labelName}
                        </Styled.WorkspaceTitle>
                        <Styled.WorkspaceEditDropdownIcon 
                        icon={faChevronDown}
                        />
                    </Styled.WorkpsaceEditButton>
                    {props.isEditingArea ? (
                        <Styled.WorkspaceEditDropdownWrapper>
                            <Styled.WorkspaceEditDropdownContainer
                            ref={props.areaDropdownEditMenuRef}
                            >
                                <Styled.WorkspaceEditInput 
                                type={'text'} 
                                autoFocus={true}
                                value={props.selectedArea.labelName} 
                                onChange={(e) => props.onChangeAreaNameOrColor({ newName: e.target.value })}
                                />
                                <p>
                                    {strings('pt-BR', 'workspaceEditColor')}
                                </p>
                                <Styled.WorkspaceEditColorSelectionContainer>
                                    {colors.map(color => (
                                        <Styled.WorkspaceEditColorSelection>
                                            <Styled.WorkspaceEditColorButton
                                            key={color}
                                            color={color}
                                            onClick={() => props.onChangeAreaNameOrColor({ newColor: color })}
                                            />
                                        </Styled.WorkspaceEditColorSelection>
                                    ))}
                                </Styled.WorkspaceEditColorSelectionContainer>
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
                                isSelected={app.uuid === props.selectedAppUUID}
                                onClick={() => props.setSelectedApp(app.uuid)}
                                >
                                    <Styled.AppsText>
                                        {app.labelName}
                                    </Styled.AppsText>
                                    <Styled.AppsRemoveButton>
                                        <Styled.AppsRemoveIcon icon={faTimes}/>
                                    </Styled.AppsRemoveButton>
                                </Styled.AppsButton>
                            ))}
                        </Styled.AppsScroller>
                    </Styled.AppsContainer>
                </Styled.TopContainer>
                <h2> Teste </h2>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
            </Styled.ContentContainer>
        </Styled.Container>
    )
}