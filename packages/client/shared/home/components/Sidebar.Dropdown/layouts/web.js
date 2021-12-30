import Styled from '../styles'
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'

export default function SidebarDropdownWebLayout(props) {
    const nestingLevel = props.nestingLevel || 0
    return (
        <Styled.WorkspaceContainer>
            <Styled.WorkspaceDropdownButton
            onMouseOver={() => props.setIsHovering(true)}
            onMouseLeave={() => props.setIsHovering(false)}
            nestingLevel={nestingLevel}
            onClick={(e) => props.onOpenOrCloseDropdown(!props.isOpen)}
            >
                <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
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
                {props.isHovering ? (
                    <Styled.HoveringButtonsContainer>
                        <Styled.WorkspaceButtonEdit
                        onClick={(e) => {
                            e.stopPropagation()
                        }}
                        >
                            {'teste'}
                        </Styled.WorkspaceButtonEdit>
                    </Styled.HoveringButtonsContainer>
                ) : ''}
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
                            />
                        )
                    })}
                    {props.workspace.apps.map(app => (
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