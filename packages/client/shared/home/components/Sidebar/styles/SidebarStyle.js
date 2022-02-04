import { APP } from '../../../../conf'
import styled from 'styled-components'
import { View, TouchableOpacity, Text } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

/**
 * @param {object} props - The props passed to the component.
 * @param {boolean} props.isFloating - Wheather the sidebar is floating or not. This means
 * it is not attached to the side and will not shrink the contents.
 * @param {boolean} props.isOpen - Wheather the sidebar is open or not when it is on the floating state.
 */
export const Container = APP === 'web' ? 
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

export const Wrapper = APP === 'web' ? 
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

export const SidebarWidth =  APP === 'web' ? 
styled.button`
    border: 0;
    background-color: transparent;
    width: 4px;
    z-index: 2;
    cursor: col-resize;
    padding: 0;
    transition: background-color 0.3s ease-in-out;

    &:hover {
        background-color: ${props => props.theme.clearGray};
    }
`
:
styled(View)``

export const TopItemsContainer = APP === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
`
:
styled(View)`
`

export const UserInfoAndCloseSidebarButtonContainer = APP === 'web' ?
styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`
:
styled(View)``

export const UserInfoContainer = APP === 'web' ?
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

export const UserNameContainer = APP === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
    margin: 5px 10px;
`
:
styled(View)``

export const UserHelloAndNameText = APP === 'web' ?
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

export const UserNameText = APP === 'web' ?
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

export const UserEmailText = APP === 'web' ?
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

export const UserDropdownButton = APP === 'web' ?
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

export const CloseSidebarButton = APP === 'web' ?
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

export const NavigationButton = APP === 'web' ?
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

export const NavigationButtonText = APP === 'web' ?
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

export const AppsContainer = APP === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 15px;
`
:
styled(View)``

export const CreateNewWorkspaceButton = APP === 'web' ?
styled.button`
    font-family: Roboto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border: 0;
    background-color:  ${props => props.theme.clearGray};
    padding: 10px;
    font-size: 18px;
    width: 100%;
    border-radius: 5px;
    text-overflow: ellipsis;
    overflow: hidden;
    margin-top: 15px;
    
    &:hover {
        cursor: pointer;
        background-color: ${props => props.theme.green_REFLOW}50;
    }
`
:
styled(TouchableOpacity)``

export const AppsAndAreasList = APP === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
    overflow: auto;
    ${props => props.isFloating ? 'max-height: calc(var(--sidebar-workspaces-height) - 100px);' : `height: var(--sidebar-workspaces-height);`}
`
:
styled(View)`
`

export const WorkspacesHeadingTitle = APP === 'web' ?
styled.h1`
    user-select: none;
    margin: 10px 0 10px 0;
    font-weight: bold;
    font-size: 15px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    color: ${props => props.theme.green_REFLOW}
`
:
styled(Text)``
