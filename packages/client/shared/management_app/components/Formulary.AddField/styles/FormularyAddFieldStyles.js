import { APP } from '../../../../conf'
import styled from 'styled-components'
import { View, TouchableOpacity } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

export const Container = APP === 'web' ? 
styled.div`
    width: 100%;
    min-height: 15px;
    max-height: 15px;
    border-radius: 3px;
    background-color: ${props => props.isHovered ? `${props.theme.gray_REFLOW}10` : 'transparent'};
    position: relative;
`
:
styled(View)``

// Reference: https://stackoverflow.com/questions/12013066/how-to-ignore-parent-elements-overflowhidden-in-css
export const ButtonWrapper = APP === 'web' ?
styled.div`
    position: absolute;
    top: calc(-50% + 2.5px);
    left: calc(50% - 12.5px);
    z-index: 1;
`
:
styled(View)``

// Reference: https://stackoverflow.com/questions/12013066/how-to-ignore-parent-elements-overflowhidden-in-css
export const ButtonContainer = APP === 'web' ?
styled.div`
    position: absolute;
    background-color: ${props => props.theme.white};
    border-radius: 50%;
    height: 25px;
    width: 25px;
`
:
styled(View)``


export const Button = APP === 'web' ?
styled.button`
    cursor: pointer;
    background-color: ${props => props.theme.green_REFLOW};
    color: ${props => props.theme.gray_REFLOW};
    border: 0;
    height: 25px;
    width: 25px;
    border-radius: 50%;
    box-shadow: 3px 3px 6px #cccccc, -3px -3px 6px #ffffff;
    
    &:hover {
        background-color: ${props => props.theme.green_REFLOW}80;
    }
`
:
styled(TouchableOpacity)``


export const FieldTypeSelectorMenuWrapper = APP === 'web' ?
styled.div`
    position: fixed;
    top: 0;
    left: 0;
    height: var(--app-height);
    width: var(--app-width);
    background-color: rgba(0, 0, 0, 0.5);
    transition: opacity 0.2s ease-in-out;
    z-index: 2
`
:
styled(View)``

export const FieldTypeSelectorMenuContainer = APP === 'web' ?
styled.div`
    position: fixed;
    display: flex;
    flex-direction: column;
    padding: 5px;
    box-shadow: rgb(56 66 95 / 8%) 4px 4px 12px;
    border: 1px solid ${props => props.theme.moreClearGray};
    background-color: ${props => props.theme.white};
    height: 200px;
    border-radius: 5px;
    z-index: 1;
    min-height: 50px;
    top: ${props => props.fieldTypeSelectorPosition.position.y}px;
    left: ${props => props.fieldTypeSelectorPosition.position.x}px;
    max-height: ${props => props.fieldTypeSelectorPosition.maxHeight !== null ? `${props.fieldTypeSelectorPosition.maxHeight}px` : 'var(--app-height)'};
    overflow-y: auto;
    opacity: ${props => props.fieldTypeSelectorPosition.wasCalculated ? '1' : '0'};
    transition: opacity 0.2s ease-in-out;
`
:
styled(View)``


export const FieldTypeButton = APP === 'web' ?
styled.button`
    cursor: pointer;
    background-color: transparent;
    border-radius: 5px;
    padding: 10px;
    border: 0;
    width: 100%;
    text-align: left;
    font-size: 13px;
    color: ${props => props.theme.darkBlue};

    &:hover {
        background-color: ${props => props.theme.clearGray};
    }
`
:
styled(TouchableOpacity)``

export const FieldTypeButtonIcon = styled(FontAwesomeIcon)`
    margin-right: 5px;
    color: ${props => props.theme.darkBlue}
`