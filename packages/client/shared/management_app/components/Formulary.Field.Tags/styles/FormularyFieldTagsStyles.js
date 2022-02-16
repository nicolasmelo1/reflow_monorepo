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

export const NotADropdownContainer = APP === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
    width: calc(100% - 10px);
    background-color: transparent;
    border-radius: 4px;
    padding: 5px;
`
:
styled(View)``

export const NotADropdownButton = APP === 'web' ?
styled.label`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 2px 10px;
    border-radius: 5px;
    ${props => props.isLast ? '' : `margin-bottom: 2px;`}
    border: 1px solid ${props => props.isSelected ? props.theme.gray_REFLOW : 'transparent'};
    transition: border 0.3s ease-in-out;
`
:
styled(TouchableOpacity)``

export const NotADropdownButtonLabel = APP === 'web' ?
styled.span`
    font-size: 12px;
    margin-left: 10px;
    padding: 10px;
    color: ${props => ![null, undefined].includes(props.color) ? 
        whiteOrBlackColor(props.color) === 'black' ? props.theme.gray_REFLOW : props.theme.white : 
        props.theme.gray_REFLOW};
    background-color: ${props => ![null, undefined].includes(props.color) ? props.color : 'transparent'};
    border-radius: 5px;
`
:
styled(Text)``