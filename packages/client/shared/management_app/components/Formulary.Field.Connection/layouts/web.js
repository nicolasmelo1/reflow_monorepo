import { Select } from '../../../../core'
import Styled from '../styles'

export default function FormularyFieldConnectionWebLayout(props) {
    return (
        <div>
            <Styled.ConfigurationFormularyContainer>
                <Select
                options={props.formularyToSelectOptions}
                onSelect={(option) => props.onChangeFormularyAppUUID(option.value)}
                />
            </Styled.ConfigurationFormularyContainer>
        </div>
    )
}