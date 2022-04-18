import { APP } from '../../../../conf'
import styled from 'styled-components'
import { View, Text, TouchableOpacity } from 'react-native'

export const Container = APP === 'web' ? 
styled.div`
    display: flex;
    flex-direction: column;
    width: calc(100% - 10px);
    background-color: ${props => props.isOpen ? `${props.theme.green_REFLOW}20` : props.theme.moreClearGray};
    border-radius: 4px;
    padding: 5px;
    min-height: 28px;
    justify-content: center;
` 
:
styled(View)``

export const ConfigurationFormularyContainer = APP === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
`
:
styled(View)``

export const FormularyAndFieldOptionFormularyContainer = APP === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
    padding: 0 5px;
    ${props => props.isToAddMarginOnBottom ? `margin-bottom: 20px;` : ''}
`
:
styled(View)``

export const SelectContainer = APP === 'web' ? 
styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid ${props => props.theme.gray_REFLOW}20;
    border-radius: 4px;
    padding: 5px;
    min-height: 28px;
    justify-content: center;
`
:
styled(View)``

export const SelectTitle = APP === 'web' ?
styled.label`
    font-size: 12px;
    color: ${props => props.theme.gray_REFLOW};
    font-weight: bold;
    margin-bottom: 5px;
`
:
styled(Text)``

export const FinishEditButton = APP === 'web' ?
styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 5px;
    width: fit-content;
    border: 0;  
    color: ${props => props.theme.darkBlue};
    background-color: ${props => props.theme.green_REFLOW}70;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 5px;
    margin-top: 20px;
    font-family: Roboto;

    &:hover {
        background-color: ${props => props.theme.green_REFLOW}50;
    }
`
:
styled(TouchableOpacity)``