import { APP } from '../../../../conf'
import styled from 'styled-components'
import { View, Text } from 'react-native'

export const Container = APP === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
    padding: 10px;
    width: calc(100% - 20px);
    border-radius: 5px;
    cursor: ${props => props.hasTooltip ? 'help' : 'not-allowed'};
`
:
styled(View)``

export const TooltipWrapper = APP === 'web' ? 
styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start
`
:
styled(View)``

export const Value = APP === 'web' ? 
styled.p`
    margin: 0;
    color: ${props => props.theme.gray_REFLOW};
`
:
styled(Text)`
    margin: 0;
    color: ${props => props.theme.gray_REFLOW};
`

export const Description = APP === 'web' ?
styled.small`
    user-select: none;
    color: ${props => props.theme.green_REFLOW};
` 
:
styled(Text)`
    color: ${props => props.theme.green_REFLOW};
    font-size: 12px;
`