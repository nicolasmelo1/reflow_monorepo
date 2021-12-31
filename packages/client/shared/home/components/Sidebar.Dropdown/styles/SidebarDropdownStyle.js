import styled from 'styled-components'
import { Text, View, TouchableOpacity, TextInput } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

export const WorkspaceContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
    overflow: auto;
`
:
styled(View)``

export const WorkspaceDropdownButton = process.env['APP'] === 'web' ?
styled.div`
    border: 0;
    background-color: ${props => props.isEditing ? `${props.theme.clearGray}` : 'transparent'};
    border-radius: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    text-align: left;
    padding: 10px 10px 10px ${props => props.nestingLevel === 0 ? '10px' : `calc((var(--sidebar-width) / 10 ) * ${props.nestingLevel})`};
    user-select: none;
    overflow: hidden;
    justify-content: space-between;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: background-color 0.3s ease-in-out;

    &:hover {
        cursor: pointer;
        ${props => props.isEditing ? '' : `background-color: ${props.theme.green_REFLOW}50`};
    }
`
:
styled(TouchableOpacity)``


export const WorkspaceDropdownButtonText = process.env['APP'] === 'web' ?
styled.p`
    user-select: none;
    text-align: left;
    font-size: 18px;
    font-weight: 500;
    margin: 0 0 0 10px;
    font-family: Roboto;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: ${props => props.theme.gray_REFLOW}
`
:
styled(Text)``

export const HoveringButtonsContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    opacity: ${props => props.isHovering ? '1' : '0'};
    transition: opacity 0.3s ease-in-out;
`
:
styled(View)``

export const WorkspaceOrAppButtonEdit = process.env['APP'] === 'web' ?
styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    background-color: ${props => props.theme.clearGray};
    border-radius: 5px;
    height: 20px;
    width: 25px;
    color: ${props => props.theme.gray_REFLOW};

    &:hover {
        opacity: 1;
        color: ${props => props.theme.clearGray};
        cursor: pointer;
        background-color: ${props => props.theme.gray_REFLOW};
    }
`
:
styled(TouchableOpacity)``

export const WorkspaceOrAppEditNameInput = process.env['APP'] === 'web' ?
styled.input`
    border: 0;
    font-size: 18px;
    font-family: Roboto;
    border-radius: 5px;
    padding: 0 5px;
    background-color: transparent;
    overflow: hidden;

    &:focus {
        border: 0;
        outline: none;
    }
`
:
styled(TextInput)``

export const WorkspaceDropdownButtonIcon = styled(FontAwesomeIcon)`
    color: ${props => props.theme.gray_REFLOW}
    font-size: 18px;
`

export const WorkspaceAppsContainer =  process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
`
:
styled(View)``

export const AppButton = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border: 0;
    background-color: ${props => props.isEditing ? `${props.theme.clearGray}` : 'transparent'};
    border-radius: 5px;
    text-align: left;
    padding: 10px 10px 10px calc((var(--sidebar-width) / 10 ) * ${props => (props.nestingLevel)});
    user-select: none;
    transition: background-color 0.3s ease-in-out;

    &:hover {
        cursor: pointer;
        ${props => props.isEditing ? '' : `background-color: ${props.theme.gray_REFLOW}50`};
    }
`
:
styled(TouchableOpacity)``

export const AppButtonText = process.env['APP'] === 'web' ?
styled.p`
    user-select: none;
    margin: 0;
    font-size: 18px;
    font-family: Roboto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`
:
styled(Text)``