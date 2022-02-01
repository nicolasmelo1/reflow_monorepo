import styled from 'styled-components'
import { View, TouchableOpacity, Text } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

export const Container = process.env['APP'] === 'web' ? 
styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: calc(100% - 20px);
    border-radius: 5px;
    padding: 10px;
    background-color: ${props => props.theme.moreClearGray};
`
:
styled(View)``

export const Button = process.env['APP'] === 'web' ? 
styled.button`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 0;
    border-radius: 5px;
    padding-bottom: 10px;
    max-width: 200px;
    padding: 10px;
    background-color: ${props => props.theme.green_REFLOW}70;
`
:
styled(TouchableOpacity)``

export const ButtonIcon = styled(FontAwesomeIcon)`
    padding-bottom: 10px;
    font-size: 40px;
    color: ${props => props.theme.darkBlue};
`

export const ButtonPlaceholderText = process.env['APP'] === 'web' ? 
styled.small`
    color: ${props => props.theme.darkBlue};
`
:
styled(Text)`
`