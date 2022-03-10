import { APP } from '../../../../conf'
import styled from 'styled-components'
import { View, Text, TouchableOpacity } from 'react-native'

export const Container = APP === 'web' ? 
styled.div`
    display: flex;
    flex-direction: column;
    padding: 0 10px 0 10px;
    width: calc(100% - 20px);
    border-radius: 5px;
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
styled(Text)``

export const EditFormulaButton = APP === 'web' ? 
 styled.button`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    border: none;
    background-color: ${props => props.theme.clearGray};
    border-radius: 5px;
    padding: 10px;
    width: auto;
    cursor: pointer;

    &:hover {
        background-color: ${props => props.theme.clearGray}90;
    }
`
:
styled(TouchableOpacity)``

export const EditFormulaButtonLabel = APP === 'web' ? 
styled.p`
    text-align: left;
    margin: 0;
    user-select: none;
    color: ${props => props.theme.green_REFLOW};
` 
:
styled(Text)``

export const Description = APP === 'web' ? 
styled.small`
    text-align: left;
    user-select: none;
    color: ${props => props.theme.green_REFLOW};
`
:
styled(Text)``
