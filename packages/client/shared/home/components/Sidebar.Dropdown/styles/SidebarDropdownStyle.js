import { APP } from '../../../../conf'
import styled from 'styled-components'
import { Text, View, TouchableOpacity, TextInput } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

export const WorkspaceContainer = APP === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
`
:
styled(View)``

export const WorkspaceAreaSelector = APP === 'web' ?
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

export const WorkspaceDropdownIconAndTextContainer = APP === 'web' ?
styled.div`
    display: flex;
    flex-direction: row;
    overflow: hidden;
    align-items: center;
    justify-content: center;
`
:
styled(View)``

export const WorkspaceDropdownButton = APP === 'web' ?
styled.button`
    border: 0;
    border-radius: 5px;
    width: 25px;
    height: 25px;
    background-color: ${props => props.isHovering ? props.theme.clearGray : 'transparent'};
    color: ${props => props.theme.gray_REFLOW};
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;

    &:hover {
        cursor: pointer;
        background-color: ${props => props.theme.gray_REFLOW};
        color: ${props => props.theme.clearGray};
    }
`
:
styled(TouchableOpacity)``

export const WorkspaceDropdownButtonText = APP === 'web' ?
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
    color: ${props => props.isInvalid ? props.theme.red_REFLOW : props.theme.gray_REFLOW}
`
:
styled(Text)``

export const HoveringButtonsContainer = APP === 'web' ?
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

export const WorkspaceOrAppButtonEdit = APP === 'web' ?
styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    background-color: ${props => props.theme.clearGray};
    border-radius: 5px;
    height: 25px;
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

export const WorkspaceOrAppEditNameInput = APP === 'web' ?
styled.input`
    border: 0;
    font-size: 18px;
    font-family: Roboto;
    border-radius: 5px;
    padding: 0 5px;
    background-color: transparent;
    overflow: hidden;
    color: ${props => props.isInvalid ? props.theme.red_REFLOW : props.theme.gray_REFLOW};
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

export const WorkspaceAppsContainer =  APP === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
`
:
styled(View)``

export const AppButton = APP === 'web' ?
styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border: 0;
    background-color: ${props => props.isEditing ? `${props.theme.clearGray}` : 'transparent'};
    border-radius: 5px;
    text-align: left;
    padding: 10px 10px 10px calc(((var(--sidebar-width) / 10 ) * ${props => (props.nestingLevel)}) + 10px);
    user-select: none;
    transition: background-color 0.3s ease-in-out;

    &:hover {
        cursor: pointer;
        ${props => props.isEditing ? '' : `background-color: ${props.theme.gray_REFLOW}50`};
    }
`
:
styled(TouchableOpacity)``

export const AppButtonText = APP === 'web' ?
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