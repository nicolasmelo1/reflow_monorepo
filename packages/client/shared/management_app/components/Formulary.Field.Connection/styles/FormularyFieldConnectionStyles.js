import { APP } from '../../../../conf'
import styled from 'styled-components'
import { View } from 'react-native'

export const ConfigurationFormularyContainer = APP === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
`
:
styled(View)``