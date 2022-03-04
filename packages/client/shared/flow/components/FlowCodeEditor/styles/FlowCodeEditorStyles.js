import { APP } from '../../../../conf'
import styled from 'styled-components'
import { View, Text } from 'react-native'

export const AutocompleteAndFunctionOrModuleDescriptionContainer = APP === 'web' ?
styled.div`
    border-radius: 5px;
    border: 1px solid ${props => props.theme.clearGray};
    box-shadow: rgb(56 66 95 / 8%) 4px 4px 12px;
    background-color: ${props => props.theme.white};
`
:
styled(View)``

export const FunctionOrModuleDescriptionContainer = APP === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
    padding: 10px;
`
:
styled(View)``

export const FunctionOrModuleDescriptionTitle = APP === 'web' ?
styled.div`
    display: flex;
    flex-direction: row;
`
:
styled(View)``
    
export const FunctionOrModuleDescriptionTitleText = APP === 'web' ?
styled.span`
    font-weight: ${props => props.isParameter ? 'normal' : 'bold'};
    background-color: ${props => props.isSelected ? `${props.theme.green_REFLOW}50` : 'transparent'};
    color: ${props => props.isParameter && props.isSelected === false ? `${props.theme.gray_REFLOW}90` : `${props.theme.gray_REFLOW}`};
    border-radius: 5px;
    margin: ${props => props.isToAddMargin ? '0 5px 0 0' : '0'};
`
:
styled(Text)``

export const FunctionOrModuleDescriptionTitleTextIsRequired = APP === 'web' ?
styled.span`
    color: ${props => props.theme.red_REFLOW};
`
:
styled(Text)``

export const FunctionOrModuleDescription = APP === 'web' ?
styled.p`
    margin: 10px 0 0 0;
    color: ${props => props.theme.gray_REFLOW};
    font-size: 14px;
    white-space: pre-wrap;
    overflow-wrap: break-word;
`
:
styled(Text)``

export const AutocompleteContainer = APP === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
    max-height: 200px;
`:
styled(View)``

export const AutocompleteOptionsContainer = APP === 'web' ?
styled.div`
    width: 50%;
    overflow-y: auto;
`
:
styled(View)``

export const AutocompleteDescriptionContainer = APP === 'web' ?
styled.div`
    width: 50%;
`
:
styled(View)``

export const AutocompleteOptionContainer = APP === 'web' ?
styled.div`
    user-select: none;
    display: flex;
    flex-direction: row;
    background-color: transparent;
    cursor: pointer;
    padding: 10px;
    border-bottom: 1px solid ${props => props.isLast ? 'transparent' : props.theme.clearGray};

    &:hover {
        background-color: ${props => props.theme.clearGray};
    }
`
:
styled(View)``

export const AutocompleteOptionText = APP === 'web' ?
styled.p`
    margin: 0;
    font-size: 13px;
    color: ${props => props.theme.gray_REFLOW};
`
:
styled(Text)``