import styled from 'styled-components'
import { View, TextInput } from 'react-native'

export const Container = process.env['APP'] === 'web' ? 
styled.div`
    display: flex;
    flex-direction: column;
`
:
styled(View)``

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
    height: 200px;
    background-color: blue;
    z-index: 2;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 5px;
    margin-top: 5px;
`
:
styled(View)``

export const SearchAndSelectedOptionsContainer = process.env['APP'] === 'web' ? 
styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    height: 100%;
`
:
styled(View)``

export const SearchInput = process.env['APP'] === 'web' ? 
styled.input`
    width: ${props => props.inputWidth}ch;
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