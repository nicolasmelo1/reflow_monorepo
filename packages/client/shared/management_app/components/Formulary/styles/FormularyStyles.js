import styled from 'styled-components'
import { View, Text, TouchableOpacity } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

export const Container = process.env['APP'] === 'web' ? 
styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: ${props => props.theme.moreClearGray};
` 
: 
styled(View)``

export const ToolbarContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: calc(100% - 20px);
    padding: 10px;
    margin-bottom: 10px;
    background-color: ${props => props.theme.white};
`
:
styled(View)``

export const ToolbarButton = process.env['APP'] === 'web' ?
styled.button`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    font-family: Roboto;
    border: 0;
    background-color: transparent;
    padding: 10px;

    &:hover {
        cursor: pointer;
        background-color: ${props => props.theme.moreClearGray};
    }
`
:
styled(TouchableOpacity)``

export const ToolbarButtonText = process.env['APP'] === 'web' ?
styled.p`
    color: ${props => props.theme.darkBlue};
    margin: 0;
    margin-left: 10px;
`
:
styled(Text)``

export const ToolbarButtonIcon = styled(FontAwesomeIcon)`
    color: ${props => props.theme.darkBlue};
`

export const FormularyTitle = process.env['APP'] === 'web' ?
styled.h1 `
    margin: 0;
    font-family: Roboto;
    font-weight: bold;
    font-size: 20px;
    margin-right: 10px;
    color: ${props => props.theme.darkBlue}
`
:
styled(Text)``

export const FormularyContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
    height: ${props => `calc(var(--app-height) - ${props.offset}px)`};
    overflow: auto;
    width: calc(100% - 20px);
    padding: 0 10px;
`
:
styled(View)``