import styled from 'styled-components'
import { View } from 'react-native'

export const Container = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
    width: calc(100% - 10px);
    background-color: ${props => props.isOpen ? `${props.theme.green_REFLOW}20` : props.theme.moreClearGray};
    border-radius: 4px;
    padding: 5px;
    min-height: 28px;
    justify-content: center;
`
:
styled(View)``
