import styled from 'styled-components'
import { View, Text, TouchableOpacity } from 'react-native'

export const Container = process.env['APP'] === 'web' ?
styled.div`
    position: relative;
    background-color: ${props => props.theme.white};
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 4px;
`
:
styled(View)``

export const FieldTitleLabel = process.env['APP'] === 'web' ? 
styled.p`
    color: ${props => props.theme.darkGray};
    margin-top: 0;
    margin-bottom: ${props => props.fieldIsHidden ? '0' : '5px'};
`
:
styled(Text)``

export const FieldEditMenu = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    position: absolute;
    top: 5px;
    right: 5px;
    opacity: ${props => props.isHovering ? '1' : '0'};
    transition: opacity 0.3s ease-in-out;
`
:
styled(View)``

export const FieldEditButtonMenu = process.env['APP'] === 'web' ?
styled.button`
    border-radius: 5px;
    border: 0;
    background-color: transparent;

    &:hover {
        cursor: pointer;
        background-color: ${props => props.theme.moreClearGray};
    }
`
:
styled(TouchableOpacity)``

export const FieldEditMenuDropdownContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
    padding: 10px;
    box-shadow: rgb(56 66 95 / 8%) 4px 4px 12px;
    background-color: ${props => props.theme.white};
    border-radius: 5px;
    z-index: 1;
`
:
styled(View)``

export const FieldEditMenuDropdownButton = process.env['APP'] === 'web' ?
styled.button`
    background-color: transparent;
    border: 0;
    border-radius: 5px;
    padding: 10px;
    text-align: right;

    &:hover {
        cursor: pointer;
        background-color: ${props => props.theme.moreClearGray};
    }
`
:
styled(TouchableOpacity)``