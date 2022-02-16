import { Switch } from '../../../../core'
import { useTheme } from 'styled-components'
import Styled from '../styles'

export default function FormularyFieldCheckboxWebLayout(props) {
    const theme = useTheme()
    
    return (
        <Styled.Container>
            <Switch
            nonSelectedBackgroundColor={theme.red_REFLOW}
            />
            <Styled.Placeholder>
                {props.field.placeholder}
            </Styled.Placeholder>
        </Styled.Container>
    )
}