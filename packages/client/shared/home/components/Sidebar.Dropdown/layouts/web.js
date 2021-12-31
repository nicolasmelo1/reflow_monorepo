import Styled from '../styles'
import { faChevronDown, faChevronRight, faPencilAlt, faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

export default function SidebarDropdownWebLayout(props) {
    const nestingLevel = props.nestingLevel || 0
    const isEditingWorkspace = props.editingAreaOrAppUUID === props.workspace.uuid
    const isEditingApp = (appUUID) => props.editingAreaOrAppUUID === appUUID

    return (
        <Styled.WorkspaceContainer>
            <Styled.WorkspaceDropdownButton
            isEditing={isEditingWorkspace}
            onMouseOver={() => props.setIsHovering(true)}
            onMouseLeave={() => props.setIsHovering(false)}
            nestingLevel={isEditingWorkspace ? 0 : nestingLevel}
            onClick={(e) => props.onToggleDropdown()}
            >
                {isEditingWorkspace ? (
                    <Styled.WorkspaceOrAppEditNameInput 
                    type={'text'}
                    autoFocus={true}
                    value={props.workspace.labelName}
                    onChange={(e) => props.onChangeWorkspaceName(e.target.value)}
                    onClick={(e) => {e.stopPropagation()}}
                    />
                ) : (
                    <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        overflow: 'hidden',
                    }}
                    > 
                        <div style={{ width: '20px'}}>
                            <Styled.WorkspaceDropdownButtonIcon 
                            icon={props.isOpen ? faChevronDown : faChevronRight}
                            />
                        </div>
                        <Styled.WorkspaceDropdownButtonText>
                            {props.workspace.labelName}
                        </Styled.WorkspaceDropdownButtonText>
                    </div>
                )}
                <Styled.HoveringButtonsContainer
                isHovering={props.isHovering}
                >
                    <Styled.WorkspaceOrAppButtonEdit
                    onClick={(e) => {
                        e.stopPropagation()
                        props.onToggleAreaOrAppEditing(isEditingWorkspace ? null : props.workspace.uuid)
                    }}
                    >
                        <FontAwesomeIcon 
                        icon={isEditingWorkspace ? faCheck : faPencilAlt}
                        />
                    </Styled.WorkspaceOrAppButtonEdit>
                </Styled.HoveringButtonsContainer>
            </Styled.WorkspaceDropdownButton>
            {props.isOpen ? (
                <Styled.WorkspaceAppsContainer>
                    {props.workspace.subAreas.map(subArea => {
                        const SidebarDropdown = require('../index').default
                        return (
                            <SidebarDropdown
                            key={subArea.uuid}
                            workspace={subArea}
                            nestingLevel={nestingLevel + 1}
                            onChangeWorkspace={props.onChangeWorkspace}
                            setEditingAreaOrAppUUID={props.setEditingAreaOrAppUUID}
                            editingAreaOrAppUUID={props.editingAreaOrAppUUID}
                            />
                        )
                    })}
                    {props.workspace.apps.map(app => (
                        <Styled.AppButton
                        key={app.uuid}
                        isEditing={isEditingApp(app.uuid)}
                        nestingLevel={isEditingApp(app.uuid) ? 0 : nestingLevel + 1}
                        onMouseOver={() => props.setHoveringAppUUID(app.uuid)}
                        onMouseLeave={() => props.setHoveringAppUUID(null)}
                        onClick={() => props.onSelectAppUUID(app.uuid)}
                        >   
                            {isEditingApp(app.uuid) ? (
                                <Styled.WorkspaceOrAppEditNameInput 
                                type={'text'}
                                autoFocus={true}
                                value={app.labelName}
                                onChange={(e) => props.onChangeAppName(e.target.value)}
                                onClick={(e) => {e.stopPropagation()}}
                                />
                            ) : (
                                <Styled.AppButtonText>
                                    {'• '}{app.labelName}
                                </Styled.AppButtonText>
                            )}
                            <Styled.HoveringButtonsContainer
                            isHovering={props.hoveringAppUUID === app.uuid}
                            >   
                                <Styled.WorkspaceOrAppButtonEdit
                                onClick={(e) => {
                                    e.stopPropagation()
                                    props.onToggleAreaOrAppEditing(isEditingApp(app.uuid) ? null : app.uuid)
                                }}
                                >
                                    <FontAwesomeIcon 
                                    icon={isEditingApp(app.uuid) ? faCheck : faPencilAlt}
                                    />
                                </Styled.WorkspaceOrAppButtonEdit>
                            </Styled.HoveringButtonsContainer>
                        </Styled.AppButton>
                    ))} 
                </Styled.WorkspaceAppsContainer>
            ): ''}
        </Styled.WorkspaceContainer>
    )
}