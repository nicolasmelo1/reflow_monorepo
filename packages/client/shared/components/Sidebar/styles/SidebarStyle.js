import styled from 'styled-components'
import { View, TouchableOpacity, Text } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

/**
 * @param {object} props - The props passed to the component.
 * @param {boolean} props.isFloating - Wheather the sidebar is floating or not. This means
 * it is not attached to the side and will not shrink the contents.
 */
export const Container = process.env['APP'] === 'web' ? 
styled.nav`
    display: flex;
    flex-direction: column;
    background-color: #fff;
    padding: 10px;
    ${props => props.isFloating ? 'position: fixed;' : ''}
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

export const UserInfoContainer = process.env['APP'] === 'web' ?
styled.div`
    padding: 0 5px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
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
    font-family: Montserrat;
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
    margin: 0 0 0 10px;
    font-family: Montserrat;
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
  
`
:
styled(View)``