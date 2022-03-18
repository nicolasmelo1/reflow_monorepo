import { APP } from '../../../../conf'
import styled from 'styled-components'
import { Text } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

export const FieldTypeText = APP === 'web' ? 
styled.span`
    font-weight: bold;
    margin-right: 10px;
    color: ${props => props.theme.darkBlue}
`
:
styled(Text)``

export const FieldTypeIcon = styled(FontAwesomeIcon)`
    margin-right: 10px;
    color: ${props => props.theme.darkBlue}
`