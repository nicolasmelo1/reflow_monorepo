import { APP } from '../../../../conf'
import { View, Text } from 'react-native'
import styled from 'styled-components'

export const DropdownMenuContainer = APP === 'web' ? 
styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 5px 0;
`
:
styled(View)``

export const DropdownMenuSwitchContainer = APP === 'web' ?
styled.div`
    user-select: none;
    padding: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
    border-radius: 5px;

    &:hover {
        background-color: ${props => props.theme.moreClearGray};
    }
`
:
styled(View)``

export const DropdownMenuSwitchLabel = APP === 'web' ?
styled.p`
    font-size: 13px;
    text-align: right;
    margin-bottom: 0;
    margin-top: 0;
    margin-left: 10px;
    color: ${props => props.theme.darkGray};
`
:
styled(Text)``