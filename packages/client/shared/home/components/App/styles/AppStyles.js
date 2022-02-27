import { APP } from '../../../../conf'
import styled from 'styled-components'
import { View } from 'react-native'

export const AppLayout = APP === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
    background-color: white;
    border-left: ${props => props.isSidebarOpen && props.isSidebarFloating === false ? `1px solid ${props.theme.background}`: '0'};
`
:
styled(View)``