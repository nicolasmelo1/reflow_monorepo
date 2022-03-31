import { APP } from '../../../../conf'
import styled from 'styled-components'
import { View, TouchableOpacity } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

export const SectionContainer = APP === 'web' ? 
styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    border: 1px solid ${props => props.theme.background};
    padding: 5px 20px;
    margin-bottom: ${props => props.isLast ? '0' : '10px'};
    border-radius: 5px;
    box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.1)
`
:
styled(View)``

export const AddButton = APP === 'web' ?
styled.button`
    cursor: pointer;
    background-color: ${props => props.theme.green_REFLOW};
    color: ${props => props.theme.white};
    border: 0;
    border-radius: 5px;
    margin-bottom: ${props => props.hasSections ? '5px' : '0'};
    width: 100%;
    padding: 5px 0;

    &:hover {
        background-color: ${props => props.theme.green_REFLOW}80;
    }
`
:
styled(TouchableOpacity)``

export const RemoveButton = APP === 'web' ?
styled.button`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 2px;
    right: 2px;
    cursor: pointer;
    background-color: transparent;
    z-index: 1;
    border: 0;
    border-radius: 5px;
    height: 20px;
    width: 20px;

    &:hover {
        background-color: ${props => props.theme.white};
    }
`
:
styled(TouchableOpacity)``

export const RemoveButtonIcon = styled(FontAwesomeIcon)`
    color: ${props => props.theme.red_REFLOW}
`