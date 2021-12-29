import styled from 'styled-components'
import { View, TouchableOpacity, Text } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

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
    background-color: ${props => props.theme.green_REFLOW};
    padding: 10px 0 0 0;
`
:
styled(View)``

export const WorkspaceTitle = process.env['APP'] === 'web' ? 
styled.h1`
    user-select: none;
    margin: 0;
    font-size: 21px;
    color: ${props => props.theme.white};
    font-weight: 600;
    margin-bottom: 10px;
`
:
styled(Text)``

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
    color: ${props => props.theme.white};
    border-radius: 4px;
    padding: 5px;
    transition: color 0.3s ease-in-out;

    &:hover {
        cursor: pointer;
        color: ${props => props.theme.gray_REFLOW};
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
styled.button`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    margin: 0;
    border: 0;
    background-color: ${props => props.isSelected ? props.theme.clearGray : props.theme.white};
    transition: background-color 0.3s ease-in-out;

    &:hover {
        cursor: pointer;
        background-color: ${props => props.theme.clearGray};
    }
`
:
styled(TouchableOpacity)``

export const AppsText = process.env['APP'] === 'web' ? 
styled.p`
    user-select: none;
    margin: 0;
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