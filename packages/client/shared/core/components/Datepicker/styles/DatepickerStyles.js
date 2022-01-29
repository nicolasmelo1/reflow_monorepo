import styled from 'styled-components'
import { TextInput, View, Text } from 'react-native'

export const Input = process.env['APP'] === 'web' ? 
styled.input`
    width: 100%;
    height: 100%;
    outline: none;
    border: 0;
    background-color: transparent;
    font-size: ${props => props.fontSize ? `${props.fontSize}px` : '15px'};
    color: white;
`
:
styled(TextInput)``

export const DatepickerWrapper = process.env['APP'] === 'web' ? 
styled.div`
    opacity: ${props => props.positionAndMaxHeight.wasCalculated === true ? '1' : '0'};
    position: fixed;
    top: 0;
    left: 0;
    height: var(--app-height);
    width: var(--app-width);
    background-color: transparent;
    transition: opacity 0.2s ease-in-out;
    z-index: 2
`
:
styled(View)``

export const DatepickerContainer = process.env['APP'] === 'web' ? 
styled.div`
    position: fixed;
    overflow: auto;
    top: ${props => props.positionAndMaxHeight.position.y}px;
    left: ${props => props.positionAndMaxHeight.position.x}px;
    max-height: ${props => props.positionAndMaxHeight.maxHeight !== null ? `${props.positionAndMaxHeight.maxHeight}px` : 'var(--app-height)'},
    border-radius: 5px;
    background-color: white;
    padding: 10px;
    box-shadow: rgb(56 66 95 / 8%) 4px 4px 12px;
`
:
styled(View)``

export const DatepickerHeader = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`
:
styled(View)``

export const DatepickerMonthTitle = process.env['APP'] === 'web' ? 
styled.h2`
    font-size: 20px;
    margin: 0;
`
:
styled(Text)``

export const DatepickerChangeMonthButtonsContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`
:
styled(View)``

export const DatepickerChangeMonthButton = process.env['APP'] === 'web' ? 
styled.button`
    border: 0;
    background-color: transparent;
    cursor: pointer;
`
:
styled(TouchableOpacity)``

export const DayOfTheWeekAndDaysOfTheMonthContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`
:
styled(View)``

export const TableRowContainer = process.env['APP'] === 'web' ? 
styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
`
:
styled(View)``

export const DayOfTheWeekAndDaysOfTheMonthCell = process.env['APP'] === 'web' ?
styled.button`
    background-color: transparent;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    padding: 5px;
    
    ${props => props.isDaysOfTheMonthCell === true ?
        props.isFromTheCurrentMonth === true ?  
            `
            cursor: ${props.isFromTheCurrentMonth === true && props.isBelowToday === false ? 'pointer': 'default'};
            border-right: 1px solid ${props.theme.clearGray};
            border-bottom: 1px solid ${props.theme.clearGray};
            ${props.isTopCell === true ? `border-top: 1px solid ${props.theme.clearGray}` : 'border-top: 0'};
            ${props.isLeftCell === true || props.isFirstDayOfTheMonth ? `border-left: 1px solid ${props.theme.clearGray}` : 'border-left: 0'};
            transition: background-color 0.2s ease-in-out;

            &:hover {
                background-color: ${props.theme.clearGray};
            }
            `
            :
            `
            ${props.isTopCell === true ? `border-bottom: 1px solid ${props.theme.clearGray}` : 'border-bottom: 0'};
            border-right: 0;
            border-left: 0;
            border-top: 0;
            `
        : 
        `
        border: 0;
        `}
`
:
styled(TouchableOpacity)``

export const DayOfTheWeekLabel = process.env['APP'] === 'web' ?
styled.p`
    font-size: 12px;
    margin: 0;
    color: ${props => props.theme.darkBlue};
    padding: 0;
    text-align: center;
`
:
styled(Text)``


export const DayLabel = process.env['APP'] === 'web' ?
styled.p`
    font-size: 12px;
    margin: 0;
    color: ${props => props.isBelowToday === true ? props.theme.clearGray : props.theme.darkBlue};
    padding: 0;
    text-align: center;
`
:
styled(Text)``