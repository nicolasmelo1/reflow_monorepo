import { View, Text, TextInput } from 'react-native'
import styled from 'styled-components'

export const MenuWrapper = APP === 'web' ?
styled.div`
    position: fixed;
    top: 0;
    left: 0;
    height: var(--app-height);
    width: var(--app-width);
    background-color: transparent;
    transition: opacity 0.2s ease-in-out;
    z-index: 2
`
:
styled(View)``


export const MenuDropdownContainer = APP === 'web' ?
styled.div`
    position: fixed;
    display: flex;
    flex-direction: column;
    padding: 10px;
    box-shadow: rgb(56 66 95 / 8%) 4px 4px 12px;
    border: 1px solid ${props => props.theme.moreClearGray};
    background-color: ${props => props.theme.white};
    border-radius: 5px;
    z-index: 1;
    min-height: 50px;
    top: ${props => props.editMenuPosition.position.y}px;
    left: ${props => props.editMenuPosition.position.x}px;
    ${props => props.editMenuPosition.maxHeight !== null ? `max-height: ${props.editMenuPosition.maxHeight}px;` : ''}
    overflow-y: auto;
    opacity: ${props => props.editMenuPosition.wasCalculated ? '1' : '0'};
    transition: opacity 0.2s ease-in-out;
`
:
styled(View)``

export const MenuDropdownSwitchContainer = APP === 'web' ?
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

export const MenuDropdownSwitchLabel = APP === 'web' ?
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

export const MenuDropdownPlaceholderInput = APP === 'web' ?
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

export const MenuDropdownButton = APP === 'web' ?
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