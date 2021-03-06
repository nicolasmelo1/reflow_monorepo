import { APP } from '../../../../conf'
import styled from 'styled-components'
import { View, TouchableOpacity } from 'react-native'

export const Layout = APP === 'web' ?
styled.div`
    height: calc(100% - 90px);
    width: 100%;
`
:
styled(View)``

export const FormularyButton = APP === 'web' ? 
styled.button`
    position: absolute;
    right: 10px;
    bottom: 10px;
    height: 50px;
    width: 50px;
    display: flex;
    font-size: 20px;
    color: ${props => props.theme.white};
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    border: 0;
    background-color: ${props => props.theme.green_REFLOW};

    &:hover {
        cursor: pointer;
        background-color: ${props => props.theme.green_REFLOW}50;
        color: ${props => props.theme.gray_REFLOW};
    }
`
:
styled(TouchableOpacity)``