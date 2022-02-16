import { APP } from '../../../../conf'
import styled from 'styled-components'
import { View } from 'react-native'

export const Container = APP === 'web' ? 
styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    border-radius: 5px;
`
:
styled(View)``


export const Placeholder = APP === 'web' ?
styled.p`
    font-size: 12px;
    margin: 0 0 0 10px;
    color: ${props => props.theme.gray_REFLOW}90;
`
:
styled(Text)``