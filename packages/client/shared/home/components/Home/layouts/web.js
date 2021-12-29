import Styled from '../styles'
import Sidebar from '../../Sidebar'

export default function HomeWebLayout(props) {
    return (
        <Styled.Container
        onMouseMove={(e) => props.onMouseMoveOpenSidebar(e)}
        >
            <Sidebar
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
                <Styled.TopContainer>
                    <Styled.WorkspaceTitle>
                        {'Vendas'}
                    </Styled.WorkspaceTitle>
                    <Styled.AppsContainer>
                        {props.isFloatingSidebar ? (
                            <Styled.SidebarButton
                            onClick={() => props.onEnableOrDisableFloatingSidebar()}
                            >
                                <Styled.SidebarButtonIcon icon='chevron-right'/>
                                <Styled.SidebarButtonIcon icon='chevron-right'/>
                            </Styled.SidebarButton>
                        ) : (
                            <Styled.SidebarButton
                            onClick={() => props.setIsOpenSidebar(!props.isOpenSidebar)}
                            >
                                <Styled.SidebarButtonIcon icon='bars'/>
                            </Styled.SidebarButton>
                        )}
                        <Styled.AppsScroller>
                            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map((item, index) => (
                                <Styled.AppsButton
                                key={item}
                                >
                                    <Styled.AppsText>
                                        {`App${item}`}
                                    </Styled.AppsText>
                                    <Styled.AppsRemoveButton>
                                        <Styled.AppsRemoveIcon icon={'times'}/>
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