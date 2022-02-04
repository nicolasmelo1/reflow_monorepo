import { APP } from '../../../../conf'
import styled from 'styled-components'
import { TextInput, View } from 'react-native'

export const Container = APP === 'web' ?
styled.div`
    width: calc(100% - 20px);
`
:
styled(View)``

export const CustomInputForDatepicker = APP === 'web' ?
styled.input`
    width: 100%;
    font-family: Roboto;
    border-radius: 4px;
    font-size: 15px;
    padding: 10px;
    background-color: ${props => props.theme.moreClearGray};
    border: 0;

    &:focus {
        background-color: ${props => props.theme.green_REFLOW}20;
        outline: none;
    }
`
:
styled(TextInput)``
