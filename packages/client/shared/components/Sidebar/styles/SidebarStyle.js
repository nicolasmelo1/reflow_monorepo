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
    flex-direction: column;
    background-color: ${props => props.theme.white};
    overflow: auto;

    ${props => props.isFloating ? `
        position: fixed;
        left: ${props.isOpen ? '0px' : '-100%'};
        top: 70px;
        z-index: 99;
        max-height: calc(var(--app-height) - 70px);
        transition: left 0.3s ease-in-out;
        border-radius: 0 5px 5px 0;
        width: var(--sidebar-width);
        padding: 10px;
    ` : `
        position: relative;
        padding: ${props.isOpen ? '10px' : '10px 0px'};
        left: ${props.isOpen ? '0px' : '-100%'};
        width: ${props.isOpen ? `${props.sidebarWidth}` : `0px`};
        transition: left 0.3s ease-in-out, padding 0.3s ease-in-out, width 0.3s ease-in-out;
    `}
`
:
styled(View)``

export const Wrapper = process.env['APP'] === 'web' ? 
styled.nav`
    display: flex;
    flex-direction: column;
    background-color: ${props => props.theme.white};
    padding: 10px;

    ${props => props.isFloating ? '' : `
        height: 100%;
    `}
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
    margin: 0;
    font-size: 16px;
    color: ${props => props.theme.gray_REFLOW}
`
:
styled(Text)``

export const UserNameText = process.env['APP'] === 'web' ?
styled.span`
    margin: 0;
    font-weight: bold;
`
:
styled(Text)``

export const UserEmailText = process.env['APP'] === 'web' ?
styled.span`
    margin: 0;
    font-size: 12px;
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

    &:hover {
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

    &:hover {
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
    margin-left: 10px;
    margin-right: 0;
    margin-top: 0;
    margin-bottom: 0;
    font-size: 18px;
    font-family: Roboto;
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
    padding: 10px 5px; 

    &:hover {
        background-color: ${props => props.theme.green_REFLOW}50
    }
`
:
styled(TouchableOpacity)``


export const WorkspaceDropdownButtonText = process.env['APP'] === 'web' ?
styled.p`
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

    &:hover {
        background-color: ${props => props.theme.gray_REFLOW}50
    }
`
:
styled(TouchableOpacity)``

export const AppButtonText = process.env['APP'] === 'web' ?
styled.p`
    margin: 0 0 0 10px;
    font-size: 18px;
    font-family: Roboto;
`
:
styled(Text)``