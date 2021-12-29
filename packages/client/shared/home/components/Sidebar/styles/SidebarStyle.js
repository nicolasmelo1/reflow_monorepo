import styled from 'styled-components'
import { View, TouchableOpacity, Text } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

/**
 * @param {object} props - The props passed to the component.
 * @param {boolean} props.isFloating - Wheather the sidebar is floating or not. This means
 * it is not attached to the side and will not shrink the contents.
 * @param {boolean} props.isOpen - Wheather the sidebar is open or not when it is on the floating state.
 */
export const Container = process.env['APP'] === 'web' ? 
styled.nav`
    display: flex;
    flex-direction: row;
    overflow: hidden;
    background-color: ${props => props.theme.white};

    ${props => props.isFloating ? `
        position: fixed;
        left: ${props.isOpen ? '0px' : '-100%'};
        top: 90px;
        z-index: 99;
        max-height: calc(var(--app-height) - 90px);
        transition: left 0.3s ease-in-out;
        border-radius: 0 5px 5px 0;
        width: var(--sidebar-width);
        box-shadow: rgb(56 66 95 / 0.08) 4px 4px 12px;
    ` : `
        position: relative;
        width:  ${props.isOpen ? 'var(--sidebar-width)' : '0px'};
        ${props.isResizing ? '' : 'transition: width 0.3s ease-in-out'};
    `}
`
:
styled(View)``

export const Wrapper = process.env['APP'] === 'web' ? 
styled.div`
    padding: 10px;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: calc(var(--sidebar-width) - 4px);
    overflow: hidden;
`
:
styled(View)``

export const SidebarWidth =  process.env['APP'] === 'web' ? 
styled.button`
    border: 0;
    background-color: transparent;
    width: 4px;
    cursor: col-resize;
    padding: 0;
    transition: background-color 0.3s ease-in-out;

    &:hover {
        background-color: ${props => props.theme.clearGray};
    }
`
:
styled(View)``

export const TopItemsContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
`
:
styled(View)`
`

export const UserInfoAndCloseSidebarButtonContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`
:
styled(View)``

export const UserInfoContainer = process.env['APP'] === 'web' ?
styled.div`
    overflow: hidden;
    padding: 0 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
`
:
styled(View)`
`

export const UserNameContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
    margin: 5px 10px;
`
:
styled(View)``

export const UserHelloAndNameText = process.env['APP'] === 'web' ?
styled.p`
    user-select: none;
    margin: 0;
    font-size: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: ${props => props.theme.gray_REFLOW}
`
:
styled(Text)``

export const UserNameText = process.env['APP'] === 'web' ?
styled.span`
    user-select: none;
    margin: 0;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`
:
styled(Text)``

export const UserEmailText = process.env['APP'] === 'web' ?
styled.span`
    user-select: none;
    margin: 0;
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: ${props => props.theme.gray_REFLOW}
`
:
styled(Text)``

export const UserDropdownButton = process.env['APP'] === 'web' ?
styled.button`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border-radius: 4px;
    padding: 10px;
    border: 0;
    transition: background-color 0.3s ease-in-out;

    &:hover {
        background-color: ${props => props.theme.green_REFLOW}50;
    }
`
:
styled(TouchableOpacity)`
`

export const UserDropdownButtonIcon = styled(FontAwesomeIcon)`
    color: #000
`

export const CloseSidebarButton = process.env['APP'] === 'web' ?
styled.button`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border-radius: 4px;
    border: 0;
    padding: 10px;
    transition: background-color 0.3s ease-in-out;

    &:hover {
        cursor: pointer;
        background-color: ${props => props.theme.gray_REFLOW}50;
    }
`
:
styled(TouchableOpacity)``

export const CloseSidebarButtonIcon = styled(FontAwesomeIcon)`
    color: ${props => props.theme.gray_REFLOW}
`

export const NavigationButton = process.env['APP'] === 'web' ?
styled.button`
    display: flex;
    background-color: transparent;
    border: 0;
    flex-direction: row;
    align-items: center;
    padding: 10px 5px;
    border-radius: 5px;
    transition: background-color 0.3s ease-in-out;

    &:hover {
        cursor: pointer;
        background-color: ${props => props.theme.green_REFLOW}50;
    }
`
:
styled(TouchableOpacity)``

export const NavigationButtonIcon = styled(FontAwesomeIcon)`
    color: #000;
    font-size: 18px;
`

export const NavigationButtonText = process.env['APP'] === 'web' ?
styled.p`
    user-select: none;
    margin-left: 10px;
    margin-right: 0;
    margin-top: 0;
    margin-bottom: 0;
    font-size: 18px;
    font-family: Roboto;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: ${props => props.theme.gray_REFLOW}
`
:
styled(Text)``

export const AppsContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
`
:
styled(View)``

export const WorkspacesHeadingTitle = process.env['APP'] === 'web' ?
styled.h1`
    user-select: none;
    margin: 10px 0 10px 0;
    font-weight: bold;
    font-size: 15px;
    color: ${props => props.theme.green_REFLOW}
`
:
styled(Text)``

export const WorkspaceContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
    overflow: auto;
`
:
styled(View)``

export const WorkspaceDropdownButton = process.env['APP'] === 'web' ?
styled.button`
    border: 0;
    background-color: transparent;
    border-radius: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    text-align: left;
    padding: 10px 5px 10px ${props => (props.nestingLevel * 20) + 5}px;
    user-select: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: background-color 0.3s ease-in-out;

    &:hover {
        cursor: pointer;
        background-color: ${props => props.theme.green_REFLOW}50
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
    color: ${props => props.theme.gray_REFLOW}
`
:
styled(Text)``

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
styled.button`
    display: flex;
    flex-direction: row;
    align-items: center;
    border: 0;
    background-color: transparent;
    border-radius: 5px;
    text-align: left;
    padding: 10px 10px 10px ${props => (props.nestingLevel * 20) + 10}px;
    user-select: none;
    transition: background-color 0.3s ease-in-out;

    &:hover {
        cursor: pointer;
        background-color: ${props => props.theme.gray_REFLOW}50
    }
`
:
styled(TouchableOpacity)``

export const AppButtonText = process.env['APP'] === 'web' ?
styled.p`
    user-select: none;
    margin: 0 0 0 10px;
    font-size: 18px;
    font-family: Roboto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`
:
styled(Text)``