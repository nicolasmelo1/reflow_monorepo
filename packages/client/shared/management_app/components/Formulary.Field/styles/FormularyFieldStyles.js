import { APP } from '../../../../conf'
import styled from 'styled-components'
import { View, Text, TouchableOpacity, TextInput } from 'react-native'

export const Container = APP === 'web' ?
styled.div`
    position: relative;
    background-color: ${props => props.theme.white};
    padding: 10px;
    border-radius: 4px;
`
:
styled(View)``

export const FieldIsHiddenAndLabelIsHiddenMessage = APP === 'web' ?
styled.small`
    margin: 0;
    font-size: 12px;
    color: ${props => props.theme.darkBlue};
    user-select: none;
`
:
styled(Text)``

export const FieldTitleLabel = APP === 'web' ? 
styled.p`
    font-size: 15px;
    padding: 5px;
    color: ${props => props.theme.darkGray};
    margin-top: 0;
    margin-bottom: ${props => props.fieldIsHidden ? '0' : '5px'};
    user-select: none;
`
:
styled(Text)``

export const LabelNameInput = APP === 'web' ?
styled.input`
    font-size: 15px;
    font-family: Roboto;
    margin-bottom: ${props => props.fieldIsHidden ? '0' : '5px'};
    padding: 5px;
    border-radius: 5px;
    border: 0 !important;
    width: calc(100% - 40px);
    outline: none;

    &:focus {
        background-color: ${props => props.theme.green_REFLOW}20;
        outline: none;
        border: 0;
    }

    &:active {
        background-color: ${props => props.theme.green_REFLOW}20;
        outline: none;
        border: 0;
    }

    &::selection {
        background: ${props => props.theme.green_REFLOW}50;
    }
`
:
styled(TextInput)``

export const FieldEditMenu = APP === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    position: absolute;
    right: 5px;
    top: 5px;
    opacity: ${props => props.isHovering ? '1' : '0'};
    transition: opacity 0.1s ease-in-out, top 0.1s ease-in-out, bottom 0.1s ease-in-out;
`
:
styled(View)``

export const FieldEditButtonMenu = APP === 'web' ?
styled.button`
    border-radius: 5px;
    border: 0;
    background-color: transparent;

    &:hover {
        cursor: pointer;
        background-color: ${props => props.theme.moreClearGray};
    }
`
:
styled(TouchableOpacity)``

export const FieldContainer = APP === 'web' ?
styled.div`
    display: ${props => props.fieldIsHidden ? 'none' : 'inline'};
`
:
styled(View)``