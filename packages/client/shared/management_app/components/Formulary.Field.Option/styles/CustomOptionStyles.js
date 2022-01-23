import styled from 'styled-components'
import { View, TouchableOpacity, Text } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import whiteOrBlackColor from '../../../../core/utils/whiteOrBlackColor'

export const CreateOptionLabel = process.env['APP'] === 'web' ?
styled.span`
    width: 100%;
    background-color: ${props => props.theme.clearGray};
    border-radius: 5px;
    margin-left: 5px;
    padding: 5px;
    color: ${props => props.theme.gray_REFLOW};
`
:
styled(Text)``

export const SelectContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: calc(100% - 10px);
    padding: 5px;
    border-radius: 5px;
`
:
styled(View)``

export const RenameInput = process.env['APP'] === 'web' ?
styled.input`
    width: 100%;
    padding: 10px 5px;
    background-color: ${props => props.theme.clearGray};
    border-radius: 5px;
    border: 0 !important;
    outline: none;
`
:
styled(Text)``

export const SelectButton = process.env['APP'] === 'web' ?
styled.button`
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-family: Roboto;
    padding: 10px 5px;
    width: 100%;
    background-color: ${props => ![null, undefined].includes(props.color) ? props.color : 'transparent'};
    color: ${props => ![null, undefined].includes(props.color) ? 
                      whiteOrBlackColor(props.color) === 'black' ? props.theme.gray_REFLOW : props.theme.white : 
                      props.theme.gray_REFLOW};
    border: 0;
    border-radius: 5px;
    text-align: left;
    transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;

    &:hover {
        color: ${props => props.theme.gray_REFLOW};
        background-color: ${props => props.theme.green_REFLOW}50;
    }
`
:
styled(TouchableOpacity)``

export const SelectHelperButtonsContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    position: absolute;
    right: 5px;
    padding: 5px;
    opacity: ${props => props.isHovering ? '1': '0'};
    transition: opacity 0.2s ease-in-out;
`
:
styled(View)``

export const SelectHelperButtons = process.env['APP'] === 'web' ?
styled.button`
    font-family: Roboto;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    padding: 5px;
    border: 0;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: ${props => props.theme.gray_REFLOW}50;
    }
`
:
styled(TouchableOpacity)``

export const SelectHelperButtonIcon = styled(FontAwesomeIcon)`
    color: ${props => props.color !== null ? 
        whiteOrBlackColor(props.color) === 'black' ? props.theme.gray_REFLOW : props.theme.clearGray : 
        props.theme.gray_REFLOW};
`

export const EditOptionMenuOverlay = process.env['APP'] === 'web' ?
styled.div`
    top: 0px;
    right: 0;
    position: fixed;
    z-index: 10;
    height: var(--app-height);
    width: var(--app-width);
    background-color: transparent;
`
:
styled(View)``

export const EditOptionMenuContainer = process.env['APP'] === 'web' ?
styled.div`
    padding: 5px;
    display: flex;
    max-width: 100px;
    flex-direction: column;
    background-color: #fff;
    border-radius: 5px;
    border: 1px solid ${props => props.theme.moreClearGray};
    position: fixed;
    top: ${props => props.editMenuPosition !== null ? props.editMenuPosition.y : 0}px;
    left: ${props => props.editMenuPosition !== null ? props.editMenuPosition.x : 0}px; 
    opacity: ${props => props.editMenuPosition !== null ? '1': '0'};
    box-shadow: rgb(56 66 95 / 8%) 4px 4px 12px;
`
:
styled(View)``

export const EditOptionMenuButton = process.env['APP'] === 'web' ?
styled.button`
    font-family: Roboto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    background-color: transparent;
    border: 0;
    border-radius: 5px;
    padding: 5px;
    color: ${props => props.isExclude ? props.theme.red_REFLOW : props.theme.gray_REFLOW};
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;

    &:hover {
        background-color: ${props => props.theme.clearGray}
    }
`
:
styled(TouchableOpacity)``

export const ColorsSelectorWrapper = process.env['APP'] === 'web' ?
styled.div`
    margin-top: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-top: 1px solid #bfbfbf
`
:
styled(View)``

export const ColorsSelectorTitle = process.env['APP'] === 'web' ?
styled.div`
    margin-top: 5px;
    margin-bottom: 5px;
    color: #bfbfbf;
    font-size: 14px
`
:
styled(View)``

export const ColorsSelectorContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center
`
:
styled(View)``

export const ColorButton = process.env['APP'] === 'web' ?
styled.button`
    cursor: pointer;
    border: 0px;
    border-radius: 4px;
    margin: 1px;
    width: 20px;
    height: 20px;
    background-color: ${props => props.color};
    transition: width 0.2s ease-in-out, height 0.2s ease-in-out;

    &:hover {
        width: 22px;
        height: 22px;
    }
`
:
styled(TouchableOpacity)``

export const SelectedOption = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 1px;
    padding: 3px 5px;
    border-radius: 5px;
    user-select: none;
    background-color: ${props => ![null, undefined].includes(props.color) ? props.color : props.theme.white};
`
:
styled(View)``


export const SelectedOptionLabel = process.env['APP'] === 'web' ?
styled.p`
    margin: 0;
    font-family: Roboto;
    font-size: 12px;
    user-select: none;
    color: ${props => ![null, undefined].includes(props.color) ? 
        whiteOrBlackColor(props.color) === 'black' ? props.theme.gray_REFLOW : props.theme.white : 
        props.theme.gray_REFLOW};
`
:
styled(Text)``


export const SelectedOptionRemoveButton = process.env['APP'] === 'web' ?
styled.button`
    user-select: none;
    font-family: Roboto;
    background-color: transparent;
    border: 0;
    width: 20px;
    height: 20px;
    border-radius: 5px;
    margin-left: 5px;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;

    &:hover {
        background-color: ${props => props.theme.red_REFLOW}
    }
`
:
styled(TouchableOpacity)``

export const SelectedOptionRemoveButtonIcon = styled(FontAwesomeIcon)`
    color: ${props => ![null, undefined].includes(props.color) ? 
        whiteOrBlackColor(props.color) === 'black' ? props.theme.gray_REFLOW : props.theme.white : 
        props.theme.gray_REFLOW};
    font-size: 12px;
`