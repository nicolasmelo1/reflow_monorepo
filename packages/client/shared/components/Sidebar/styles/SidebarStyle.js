import styled from 'styled-components'
import { View } from 'react-native'


export const Container = process.env['APP'] === 'web' ? 
styled.nav`
    display: flex;
    flex-direction: column;
    background-color: red;
`
:
styled(View)``


export const TopItemsContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
    background-color: blue;
`
:
styled(View)`
`