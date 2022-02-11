import { APP } from '../../../../conf'
import styled from 'styled-components'
import { View, TouchableOpacity, Text } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

export const DetailContainer = APP === 'web' ?
styled.div`
    top: 0;
    left: 0;
    z-index: 1;
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: var(--app-width);
    height: var(--app-height);
    background-color: rgba(0, 0, 0, 0.9);
`
:
styled(View)``

export const DetailHeader = APP === 'web' ?
styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: calc(100% - 20px);
    padding: 10px;
`
:
styled(View)``

export const DetailCloseButton = APP === 'web' ?
styled.button`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border: 0;
    border-radius: 5px;
    height: 25px;
    width: 25px;
    cursor: pointer;

    &: hover {
        background-color: ${props => props.theme.gray_REFLOW};
    }
`
:
styled(TouchableOpacity)``

export const DetailCloseButtonIcon = styled(FontAwesomeIcon)`
    font-size: 15px;
    color: ${props => props.theme.white};
`

export const DetailHeaderTitle = APP === 'web' ?
styled.p`
    font-size: 15px;
    width: 100%;
    text-align: center;
    color: ${props => props.theme.white};
`
:
styled(Text)``

export const DetailContent = APP === 'web' ?
styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: calc(100% - 10px);
    height: 100%;
`
:
styled(View)``

export const ArrowButton = APP === 'web' ?
styled.button`
    background-color: transparent;
    border: 0;
    border-radius: 5px;
    height: 100%;
    max-width: 100px;
    min-width: 20px;
    width: calc(100% / 3);
    ${props => props.disabled === true ? '' : `cursor: pointer;`}

    &:hover {
        background-color: ${props => props.disabled === true ? 'transparent' : props.theme.gray_REFLOW};
    }
`
:
styled(View)``

export const ArrowsIcon = styled(FontAwesomeIcon)`
    font-size: 30px;
    color: ${props => props.theme.white};
`

export const DetailContentContainer = APP === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    user-select: none;
    pointer-events: none;
    user-drag: none;
    padding: 10px;
`
:
styled(View)``

export const DetailFooter = APP === 'web' ?
styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: calc(100% - 20px);
    padding: 10px;
`
:
styled(View)``

export const DetailFooterButtonsContainer = APP === 'web' ?
styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`
:
styled(View)``

export const DetailFooterButton = APP === 'web' ?
styled.button`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border: 0;
    border-radius: 5px;
    height: 25px;
    width: 25px;
    cursor: pointer;
    color: ${props => props.theme.white};
    
    &: hover {
        background-color: ${props => props.theme.gray_REFLOW};
    }
`
:
styled(TouchableOpacity)``

export const DetailFooterButtonIcon = styled(FontAwesomeIcon)`
    font-size: 15px;
    color: ${props => props.theme.white};
`

export const DownloadButton = APP === 'web' ?
styled.button`
    background-color: ${props => props.theme.green_REFLOW};
    border: 0;
    border-radius: 5px;
    cursor: pointer;
    color: ${props => props.theme.white};
    padding: 10px;

    &: hover {
        background-color: ${props => props.theme.green_REFLOW}90;
    }
`
:
styled(TouchableOpacity)``