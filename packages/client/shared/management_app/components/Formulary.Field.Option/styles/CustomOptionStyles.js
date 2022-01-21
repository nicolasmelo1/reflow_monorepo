import styled from 'styled-components'
import { View, TouchableOpacity } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

export const CreateOptionLabel = process.env['APP'] === 'web' ?
styled.span`
    width: 100%;
    background-color: ${props => props.theme.clearGray};
    border-radius: 5px;
    margin-left: 5px;
    padding: 5px;
    color: ${props => props.theme.darkBlue}
`
:
styled(Text)``

export const SelectContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: calc(100% - 10px);
    padding: 5px;
    border-radius: 5px;
`
:
styled(View)``

export const SelectButton = process.env['APP'] === 'web' ?
styled.button`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-family: Roboto;
    padding: 10px 5px;
    width: 100%;
    background-color: transparent;
    border: 0;
    border-radius: 5px;
    text-align: left;
    transition: background-color 0.2s ease-in-out;

    &:hover {
        background-color: ${props => props.theme.green_REFLOW}50;
    }
`
:
styled(TouchableOpacity)``

export const SelectHelperButtonsContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    opacity: ${props => props.isHovering ? '1': '0'};
    transition: opacity 0.2s ease-in-out;
`
:
styled(View)``

export const SelectHelperButtons = process.env['APP'] === 'web' ?
styled.button`
    font-family: Roboto;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    padding: 5px;
    border: 0;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: ${props => props.theme.clearGray}
    }
`
:
styled(TouchableOpacity)``

export const SelectHelperButtonIcon = styled(FontAwesomeIcon)`
    color: ${props => props.theme.darkGray}
`

export const EditOptionMenuOverlay = process.env['APP'] === 'web' ?
styled.div`
    top: 0px;
    right: 0;
    position: fixed;
    z-index: 10;
    height: var(--app-height);
    width: var(--app-width);
    background-color: transparent;
`
:
styled(View)``

export const EditOptionMenuContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border-radius: 5px;
    border: 1px solid ${props => props.theme.moreClearGray};
    position: fixed;
    top: ${props => props.editMenuPosition !== null ? props.editMenuPosition.y : 0}px;
    left: ${props => props.editMenuPosition !== null ? props.editMenuPosition.x : 0}px; 
    opacity: ${props => props.editMenuPosition !== null ? '1': '0'};
    box-shadow: rgb(56 66 95 / 8%) 4px 4px 12px;
`
:
styled(View)``