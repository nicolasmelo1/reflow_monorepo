import { APP } from '../../../../conf'
import styled from 'styled-components'
import { View, TouchableOpacity } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

export const DropdownMenuInputContainer = APP === 'web' ? 
styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 5px 0;
`
:
styled(View)``


export const IsToEditFormulaButton = APP === 'web' ?
styled.button`
    text-align: left;
    border-radius: 5px;
    padding: 10px;
    width: 100%;
    background-color: transparent;
    border: 0;
    cursor: pointer;
    color: ${props => props.theme.darkGray};

    &:hover {
        background-color: ${props => props.theme.moreClearGray};
    }
`
:
styled(TouchableOpacity)``


export const IsToEditFormulaButtonIcon = styled(FontAwesomeIcon)`
    color: ${props => props.theme.gray_REFLOW};
    margin-right: 5px;
`

