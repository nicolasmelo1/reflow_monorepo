import styled from 'styled-components'
import { View, TouchableOpacity, Text, TextInput } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import whiteOrBlackColor from '../../../../core/utils/whiteOrBlackColor'

export const Container = process.env['APP'] === 'web' ? 
styled.div`
    display: flex;
    flex-direction: row;
    overflow: hidden;
    width: var(--app-width);
    height: var(--app-height);
`
:
styled(View)``

export const ContentContainer = process.env['APP'] === 'web' ? 
styled.div`
    width: ${props => props.isFloating ? 'var(--app-width)' : 
            props.isOpen ? 'calc(var(--app-width) - var(--sidebar-width))' : 'var(--app-width)'};
    background-color: ${props => props.theme.background};
    ${props => props.isFloating === false && props.isResizing === false ? `transition: width 0.3s ease-in-out;`: ''}
`
:
styled(View)``

export const TopContainer = process.env['APP'] === 'web' ? 
styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: ${props => [null, undefined].includes(props.color) ? props.theme.green_REFLOW : props.color};
    padding: 10px 0 0 0;
    transition: background-color 0.3s ease-in-out;
`
:
styled(View)``

export const WorkspaceTitle = process.env['APP'] === 'web' ? 
styled.h1`
    font-family: Roboto;
    user-select: none;
    margin: 0;
    margin-right: 10px;
    font-size: 21px;
    color: ${props => whiteOrBlackColor(props.backgroundColor) === 'black' ? props.theme.gray_REFLOW : props.theme.white};
    font-weight: 600;
    transition: color 0.3s ease-in-out;
`
:
styled(Text)``

export const WorkspaceEditDropdownIcon = styled(FontAwesomeIcon)`
    color: ${props => whiteOrBlackColor(props.backgroundColor) === 'black' ? props.theme.gray_REFLOW : props.theme.white};
`

export const WorkpsaceEditButton = process.env['APP'] === 'web' ?
styled.button`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    border: 0;
    border-radius: 5px;
    margin-bottom: 10px;

    &:hover {
        cursor: pointer;
        background-color: ${props => props.theme.clearGray}50;
    }
`
:
styled(TouchableOpacity)``

export const WorkspaceEditDropdownWrapper = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    position: relative;
    flex-direction: row;
    align-tems: center;
    justify-content: center
`
:
styled(View)``

export const WorkspaceEditDropdownContainer = process.env['APP'] === 'web' ?
styled.div`
    position: absolute;
    top: 0;
    background-color: ${props => props.theme.white};
    border-radius: 5px;
    padding: 10px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`
:
styled(View)``

export const WorkspaceEditInput = process.env['APP'] === 'web' ?
styled.input`
    border: 1px solid ${props => props.theme.clearGray};
    text-align: center;
    min-width: 150px;
    max-width: 480px;
    width: calc(var(--app-width) - var(--sidebar-width) - 200px);
    margin-bottom: 10px;
    font-size: 18px;
    font-family: Roboto;
    background-color: ${props => props.theme.clearGray};
    padding: 5px;
    border-radius: 5px;

    &:focus {
        outline: none;
        border: 1px solid ${props => props.theme.gray_REFLOW}50;
    }
`
:
styled(TextInput)``

export const WorkspaceEditColorSelectionContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: row
    width: 100%;
    flex-wrap: wrap;
    justify-content: center
`
:
styled(View)``

export const WorkspaceEditColorSelection = process.env['APP'] === 'web' ?
styled.div`
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center
`
:
styled(View)``

export const WorkspaceEditColorButton = process.env['APP'] === 'web' ?
styled.button`
    border: 0;
    width: 20px;
    height: 20px;
    border-radius: 5px;
    background-color: ${props => props.color};
    cursor: pointer;
    transition: width 0.3s ease-in-out, height 0.3s ease-in-out;

    &:hover {
        width: 25px;
        height: 25px;
    }
`
:
styled(TouchableOpacity)``

export const AppsContainer = process.env['APP'] === 'web' ? 
styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
`
:
styled(View)``

export const SidebarButton = process.env['APP'] === 'web' ? 
styled.button`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    margin-right: 10px;
    margin-left: 10px;
    font-size: 15px;
    border: 0;
    color: ${props => whiteOrBlackColor(props.backgroundColor) === 'black' ? props.theme.gray_REFLOW : props.theme.white};
    border-radius: 4px;
    padding: 5px;
    transition: color 0.3s ease-in-out;

    &:hover {
        cursor: pointer;
        color: ${props => whiteOrBlackColor(props.backgroundColor) === 'black' ? props.theme.white : props.theme.gray_REFLOW}};
    }
`
:
styled(TouchableOpacity)``

export const SidebarButtonIcon = styled(FontAwesomeIcon)``

export const AppsScroller = process.env['APP'] === 'web' ? 
styled.div`
    display: flex;
    flex-direction: row;
    overflow-x: auto;

    scrollbar-color: ${props => props.theme.white} transparent;
    scrollbar-width: thin;

    &::-webkit-scrollbar-thumb {
        background: ${props => props.theme.white};
        border-radius: 5px;
    }

    &::-webkit-scrollbar {
        -webkit-appearance: none;
        width: 8px;
        height: 8px;
        background-color: transparent;
    }
`
:
styled(View)``

export const AppsButton = process.env['APP'] === 'web' ? 
styled.div`
    
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    margin: 0;
    border: 1px solid ${props => props.isSelected ? props.theme.clearGray : props.theme.white};
    background-color: ${props => props.isSelected ? props.theme.clearGray : props.theme.white};
    transition: background-color 0.3s ease-in-out, border 0.3s ease-in-out;

    &:hover {
        cursor: pointer;
        border: 1px solid ${props => props.theme.gray_REFLOW}50;
        background-color: ${props => props.theme.clearGray};
    }
`
:
styled(TouchableOpacity)``

export const AppsText = process.env['APP'] === 'web' ? 
styled.p`
    user-select: none;
    margin: 0;
    font-size: 10px;
    margin-right: 10px;
    color: ${props => props.theme.gray_REFLOW};
`
:
styled(Text)`` 

export const AppsRemoveButton = process.env['APP'] === 'web' ?
styled.button`
    border: 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    padding: 5px;
    border-radius: 4px;
    transition: background-color 0.3s ease-in-out;

    &:hover {
        cursor: pointer;
        background-color: ${props => props.theme.white};
    }
`
:
styled(TouchableOpacity)``

export const AppsRemoveIcon = styled(FontAwesomeIcon)`
    color: ${props => props.theme.gray_REFLOW};
`