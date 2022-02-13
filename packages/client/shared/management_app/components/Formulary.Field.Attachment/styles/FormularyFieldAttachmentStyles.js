import { APP } from '../../../../conf'
import styled from 'styled-components'
import { View, TouchableOpacity, Text } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

export const Container = APP === 'web' ? 
styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    border-radius: 5px;
    background-color: ${props => props.isDraggingOver ? `${props.theme.green_REFLOW}90` : props.theme.moreClearGray};
    cursor: ${props => props.isDraggingOver ? 'copy' : 'auto'};
    ${props => ![null, undefined, 0].includes(props.heightOfContainer) ? `height: ${props.heightOfContainer}px;` : ''}
`
:
styled(View)``

export const AddNewFileButton = APP === 'web' ?
styled.label`
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 5px 0 0;
    padding: 0;
`
:
styled(TouchableOpacity)``

export const AddNewFileButtonIcon = styled(FontAwesomeIcon)`
    font-size: 20px;
    color: ${props => props.theme.darkBlue};
`

export const Button = APP === 'web' ? 
styled.label`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 0;
    border-radius: 5px;
    padding-bottom: 10px;
    max-width: 200px;
    padding: 10px;
    background-color: ${props => props.theme.green_REFLOW}70;
`
:
styled(TouchableOpacity)``

export const ButtonIcon = styled(FontAwesomeIcon)`
    padding-bottom: 10px;
    font-size: 40px;
    color: ${props => props.theme.darkBlue};
`

export const ButtonPlaceholderText = APP === 'web' ? 
styled.small`
    text-align: center;
    font-size: 12px;
    color: ${props => props.theme.darkBlue};
`
:
styled(Text)`
`

export const ContainerWrapper = APP === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 10px;
    border-radius: 5px;
    background-color: transparent;
`
:
styled(View)``

export const FilesScrollerContainer = APP === 'web' ?
styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    height: 100%;
    overflow: auto;
`
:
styled(View)``

export const FileContainer = APP === 'web' ?
styled.div`
    cursor: pointer;
    display: flex;
    flex-direction: column;
    border: 1px solid ${props => props.theme.darkBlue}50;
    padding: 5px;
    margin: 5px;
    border-radius: 5px;
`
:
styled(View)``

export const ImageWrapper = APP === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    cursor: pointer;
`
:
styled(View)``

export const DragAndDropMessage = APP === 'web' ?
styled.p`
    text-align: center;
    font-size: 12px;
    color: ${props => props.theme.darkBlue};
    font-weight: bold;
`
:
styled(Text)``
