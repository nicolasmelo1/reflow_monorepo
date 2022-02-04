import { APP } from '../../../../conf'
import styled from 'styled-components'

export const AppLayout = APP === 'web' ?
styled.div`
    height: 100%;
    width: 100%;
    background-color: white;
    border-left: ${props => props.isSidebarOpen && props.isSidebarFloating === false ? `1px solid ${props.theme.background}`: '0'};
`
:
styled(View)``