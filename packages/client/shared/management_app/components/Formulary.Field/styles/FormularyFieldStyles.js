import styled from 'styled-components'
import { View, Text, TouchableOpacity, TextInput } from 'react-native'

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

export const FieldIsHiddenAndLabelIsHiddenMessage = process.env['APP'] === 'web' ?
styled.small`
    margin: 0;
    font-size: 12px;
    color: ${props => props.theme.darkBlue};
    user-select: none;
`
:
styled(Text)``

export const FieldTitleLabel = process.env['APP'] === 'web' ? 
styled.p`
    font-size: 15px;
    padding: 5px;
    color: ${props => props.theme.darkGray};
    margin-top: 0;
    margin-bottom: ${props => props.fieldIsHidden ? '0' : '5px'};
    user-select: none;
`
:
styled(Text)``

export const LabelNameInput = process.env['APP'] === 'web' ?
styled.input`
    font-size: 15px;
    font-family: Roboto;
    margin-bottom: ${props => props.fieldIsHidden ? '0' : '5px'};
    padding: 5px;
    border-radius: 5px;
    border: 0 !important;
    width: calc(100% - 40px);
    outline: none;

    &:focus {
        background-color: ${props => props.theme.green_REFLOW}20;
        outline: none;
        border: 0;
    }

    &:active {
        background-color: ${props => props.theme.green_REFLOW}20;
        outline: none;
        border: 0;
    }

    &::selection {
        background: ${props => props.theme.green_REFLOW}50;
    }
`
:
styled(TextInput)``

export const FieldEditMenu = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: ${props => props.isAtBottom ? 'column': 'column-reverse'};
    align-items: flex-end;
    position: absolute;
    right: 5px;
    ${props => props.isAtBottom ? 'top: 5px;' : 'bottom: calc(100% - 22px);'}
    opacity: ${props => props.isHovering ? '1' : '0'};
    transition: opacity 0.3s ease-in-out, top 0.1s ease-in-out, bottom 0.1s ease-in-out, opacity 0.3s ease-in-out;
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
    min-height: 100px;
    ${props => props.maximumHeight !== undefined ? `max-height: ${props.maximumHeight}px;` : ''}
    overflow-y: auto;
`
:
styled(View)``

export const FieldEditMenuDropdownButton = process.env['APP'] === 'web' ?
styled.button`
    background-color: transparent;
    border: 0;
    border-radius: 5px;
    padding: 10px;
    text-align: left;
    font-family: Roboto;
    font-size: 13px;
    cursor: pointer;
    color: ${props => props.isExclude ? props.theme.red_REFLOW : props.theme.darkGray};

    &:hover {
        background-color: ${props => props.theme.moreClearGray};
    }
`
:
styled(TouchableOpacity)``

export const FieldEditMenuDropdownSeparator = process.env['APP'] === 'web' ?
styled.hr`
    color: ${props => props.theme.clearGray};
    background-color: ${props => props.theme.clearGray};
    border: 1px solid ${props => props.theme.clearGray};
    width: calc(100% - 5px);
    margin: 2px 0;
`
:
styled(View)``

export const FieldEditMenuDropdownSwitchContainer = process.env['APP'] === 'web' ?
styled.div`
    user-select: none;
    padding: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
    border-radius: 5px;

    &:hover {
        background-color: ${props => props.theme.moreClearGray};
    }
`
:
styled(View)``

export const FieldEditMenuDropdownSwitchLabel = process.env['APP'] === 'web' ?
styled.p`
    font-size: 13px;
    text-align: right;
    margin-bottom: 0;
    margin-top: 0;
    margin-left: 10px;
    color: ${props => props.disabled ? props.theme.clearGray : props.theme.darkGray};
`
:
styled(Text)``

export const FieldEditMenuDropdownPlaceholderInput = process.env['APP'] === 'web' ?
styled.input`
    font-size: 13px;
    font-family: Roboto;
    margin-bottom: 0;
    padding: 10px;
    border: 0 !important;
    outline: none !important;
    border-radius: 5px;
    background-color: ${props => props.theme.clearGray};

    &:focus {
        background-color: ${props => props.theme.green_REFLOW}20;
        outline: none;
    }
`
:
styled(TextInput)``