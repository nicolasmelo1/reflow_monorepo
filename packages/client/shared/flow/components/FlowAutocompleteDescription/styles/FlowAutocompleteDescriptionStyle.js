import { APP } from '../../../../conf'
import styled from 'styled-components'
import { View, Text } from 'react-native'

export const Container = APP === 'web' ? 
styled.div`
    padding: 10px;
    border-left: 1px solid #ccc;
    display: flex;
    flex-direction: column;
`
:
styled(View)

export const TitleContainer = APP === 'web' ?
styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
`
:
styled(View)``

export const Title = APP === 'web' ?
styled.h1`
    margin: 0;
    font-size: 17px;
    font-weight: bold;
    color: ${props => props.theme.gray_REFLOW};
`
:
styled(Text)``

export const TitleContents = APP === 'web' ?
styled.span`
    font-weight: ${props => props.isParameter ? 'normal' : 'bold'};
    background-color: transparent;
    color: ${props => props.isParameter ? `${props.theme.gray_REFLOW}90` : `${props.theme.gray_REFLOW}`};
    border-radius: 5px;
    margin: ${props => props.isToAddMargin ? '0 5px 0 0' : '0'};
`
:
styled(Text)``

export const TitleIsRequiredParameter = APP === 'web' ?
styled.span`
    color: ${props => props.theme.red_REFLOW};
`
:
styled(Text)``

export const MenuTitle = APP === 'web' ? 
styled.p`
    margin: 15px 0 10px 0;
    color: ${props => props.theme.gray_REFLOW}90;
    font-size: 15px;
    font-weight: bold;
`
:
styled(Text)``

export const Description = APP === 'web' ?
styled.p`
    margin: 0;
    font-size: 14px;
    color: ${props => props.theme.gray_REFLOW}90;
`
:
styled(Text)``

export const ParameterDescriptionContainer = APP === 'web' ?
styled.p`
    margin-top: 0;
    margin-bottom: 5px;
    white-space: pre-wrap;
`
:
styled(Text)``

export const ParameterName = APP === 'web' ?
styled.span`
    font-weight: bold;
    color: ${props => props.theme.gray_REFLOW};
    border: 1px solid ${props => props.theme.clearGray};
    padding: 0 2px;
    border-radius: 5px;
    font-size: 14px;
    background-color: ${props => props.theme.clearGray};
`
:
styled(Text)``

export const ParameterDescription = APP === 'web' ?
styled.span`
    color: ${props => props.theme.gray_REFLOW}90;
    font-size: 14px;
`
:
styled(Text)``
