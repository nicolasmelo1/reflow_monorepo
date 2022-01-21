import styled from 'styled-components'
import { TextInput } from 'react-native'

export const Container = process.env['APP'] === 'web' ?
styled.div`
    width: calc(100% - 20px);
`
:
styled(View)``

export const Input = process.env['APP'] === 'web' ?
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

export const DropdownMenuOptionButton = process.env['APP'] === 'web' ?
styled.button`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    background-color: transparent;
    border: 0;
    border-radius: 5px;
    padding: 10px;
    text-align: right;
    font-family: Roboto;
    font-size: 13px;
    cursor: pointer;
    color: ${props => props.theme.darkGray};

    &:hover {
        background-color: ${props => props.theme.moreClearGray};
    }
`
:
styled(View)``

export const DropdownMenuOptionSelectContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
    position: fixed;
    box-shadow: rgb(56 66 95 / 8%) 4px 4px 12px;
    border: 1px solid ${props => props.theme.moreClearGray};
    padding: 5px;
    border-radius: 5px;
    max-height: var(--app-height);
    overflow: auto;
    background-color: ${props => props.theme.white};
    top: ${props => props.menuPosition !== null ? props.menuPosition.y : 0}px;
    left: ${props => props.menuPosition !== null ? props.menuPosition.x : 0}px;
    opacity: ${props => props.menuPosition !== null ? 1 : 0};
    transition: top 0.1s ease-in-out, left 0.1s ease-in-out, opacity: 0.1s ease-in-out;
`
:
styled(View)``

export const DropdownMenuOptionSelectButton = process.env['APP'] === 'web' ?
styled.button`
    text-align: left;
    background-color: ${props => props.isSelected ? `${props.theme.green_REFLOW}50` : 'transparent'};
    border-radius: 5px;
    border: 0;
    margin-bottom: ${props => props.isLast ? '0': '5px'};
    padding: 5px;
    cursor: pointer;
    
    &:hover {
        background-color: ${props => props.theme.clearGray};
    }
`
:
styled(TouchableOpacity)``

export const DropdownMenuOptionSelectButtonText = process.env['APP'] === 'web' ?
styled.p`
    margin-bottom: 0px;
    margin-top: 0px;
    margin-right: 5px;
`
:
styled(Text)``
