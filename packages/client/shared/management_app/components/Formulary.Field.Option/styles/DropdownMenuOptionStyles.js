import { APP } from '../../../../conf'
import styled from 'styled-components'
import { Text, View } from 'react-native'

export const DropdownMenuInputContainer = APP === 'web' ? 
styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 10px;
`
:
styled(View)``

export const SwitchFieldLabel = APP === 'web' ?
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