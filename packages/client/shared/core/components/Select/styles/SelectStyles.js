import styled from 'styled-components'
import { View, TextInput, TouchableOpacity, Text } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

export const Container = process.env['APP'] === 'web' ? 
styled.div`
    display: flex;
    flex-direction: column;
`
:
styled(View)``

export const SelectedOption = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: ${props => props.theme.green_REFLOW};
    border-radius: 5px;
    margin: 1px 2px;
`
:
styled(TouchableOpacity)``

export const SelectedOptionLabel = process.env['APP'] === 'web' ?
styled.p`
    user-select: none;
    margin: 0;
    font-size: 12px;
    padding: 5px;
    color: ${props => props.theme.moreClearGray};
`
:
styled(Text)``

export const SelectedOptionRemoveButton = process.env['APP'] === 'web' ? 
styled.button`
    background-color: transparent;
    border: 0;
    border-radius: 5px;
    margin-left: 1px;
    padding: 5px;
    
    &:hover {
        background-color: ${props => props.theme.red_REFLOW}
    }
`
:
styled(TouchableOpacity)``

export const SelectedOptionRemoveButtonIcon = styled(FontAwesomeIcon)`
    color: ${props => props.theme.moreClearGray};
    font-size: 12px;
`


export const OptionsContainerWrapper = process.env['APP'] === 'web' ?
styled.div`
    position: relative;
    width: 100%;
`
:
styled(View)``

export const OptionsContainer = process.env['APP'] === 'web' ?
styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    max-height: 200px;
    background-color: ${props => props.theme.white};
    z-index: 1;
    box-shadow: rgb(56 66 95 / 8%) 4px 4px 12px;
    border-radius: 5px;
    margin-top: 5px;

    ${props => props.isToLoadOptionsOnBottom ? '' : `
        transform: ${props.offset === 0 ? `translateY(-100% - 30px)` : `translateY(-${props.offset + 8}px)`};
        transition: transform 0.1s ease-in-out;
    `}
`
:
styled(View)``

export const SearchAndSelectedOptionsContainer = process.env['APP'] === 'web' ? 
styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-flow: wrap;
    width: 100%;
    height: 100%;
`
:
styled(View)``

export const SearchInput = process.env['APP'] === 'web' ? 
styled.input`
    width: ${props => props.inputWidth > 1 ? props.inputWidth + 1 : props.inputWidth}ch;
    overflow: hidden;
    outline: none !important;
    border: 0 !important;
    font-family: Roboto;
    background-color: transparent;

    &:focus {
        outline: none;
    }

    &:active {
        outline: none;
    }

    &::selection {
        background: ${props => props.theme.green_REFLOW}50;
    }
` 
:
styled(TextInput)``

export const OptionContainer = process.env['APP'] === 'web' ?
styled.div`
    width: 100%;
    padding: 5px;
`
:
styled(View)``

export const OptionButton = process.env['APP'] === 'web' ?
styled.button`
    text-align: left;
    background-color: transparent;
    border-radius: 5px;
    padding: 10px;
    border: 0;
    width: calc(100% - 10px);
    transition: background-color 0.3s ease-in-out;

    &:hover {
        background-color: ${props => props.theme.green_REFLOW}50;
    }
`
:
styled(TouchableOpacity)``