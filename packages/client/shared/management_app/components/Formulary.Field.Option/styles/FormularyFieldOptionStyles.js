import { APP } from '../../../../conf'
import styled from 'styled-components'
import { View, TouchableOpacity } from 'react-native'

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
    padding: 10px;
    ${props => props.isLast ? '' : `margin-bottom: 2px;`}
    background-color: ${props => ![null, undefined].includes(props.color) ? props.color : 'transparent'};
    border-radius: 5px;
    font-size: 12px;
`
:
styled(TouchableOpacity)``