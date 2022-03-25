import { APP } from '../../../../conf'
import styled from 'styled-components'
import { Text, View } from 'react-native'

export const DropdownMenuInputContainer = APP === 'web' ? 
styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0;
`
:
styled(View)``

export const RenameFieldButton = APP === 'web' ?
styled.button`
    cursor: pointer;
    width: 100%;
    padding: 10px;
    font-size: 13px;
    text-align: left;
    margin-bottom: 0;
    border-radius: 5px;
    margin-top: 0;
    background-color: transparent;
    border: 0;
    color: ${props => props.theme.darkGray};

    &:hover {
        background-color: ${props => props.theme.moreClearGray};
    }
`
:
styled(Text)``