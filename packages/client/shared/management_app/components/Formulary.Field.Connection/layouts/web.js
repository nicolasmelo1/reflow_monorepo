import { Struct } from '../../../../../../shared/flow/parser/nodes'
import { Select, strings } from '../../../../core'
import Styled from '../styles'

export default function FormularyFieldConnectionWebLayout(props) {
    const hasFieldToSelectOptions = props.fieldToSelectOptions.length > 0
    const isEditingConnectionField = props.isEditingField === true
    const isFormularyAppAndFieldToUseAsOptionDefined = typeof props.field?.connectionField?.fieldAsOptionUUID === 'string' &&
        typeof props.field?.connectionField?.formularyAppUUID === 'string'

    return isEditingConnectionField ? (
        <Styled.ConfigurationFormularyContainer>
            <Styled.FormularyAndFieldOptionFormularyContainer
            isToAddMarginOnBottom={hasFieldToSelectOptions}
            >
                <Styled.SelectTitle>
                    {strings('formularyFieldConnectionFormularySelectLabel')}
                </Styled.SelectTitle>
                <Styled.SelectContainer>
                    <Select
                    options={props.formularyToSelectOptions}
                    onRemove={() => props.onChangeFormularyAppUUID()}
                    onSelect={(option) => props.onChangeFormularyAppUUID(option.value)}
                    />
                </Styled.SelectContainer>
            </Styled.FormularyAndFieldOptionFormularyContainer>
            {hasFieldToSelectOptions ? (
                <Styled.FormularyAndFieldOptionFormularyContainer>
                    <Styled.SelectTitle>
                        {strings('formularyFieldConnectionFieldSelectLabel')}
                    </Styled.SelectTitle>
                    <Styled.SelectContainer>
                        <Select
                        options={props.fieldToSelectOptions}
                        onRemove={() => props.onChangeFieldAsOptionUUID()}
                        onSelect={(option) => props.onChangeFieldAsOptionUUID(option.value)}
                        />
                    </Styled.SelectContainer>
                </Styled.FormularyAndFieldOptionFormularyContainer>
            ) : null}
            {isFormularyAppAndFieldToUseAsOptionDefined ? (
                <Styled.FinishEditButton
                onClick={() => props.onToggleEditMode(false)}
                >
                    {'Finalizar edição'}
                </Styled.FinishEditButton>
            ) : null}
        </Styled.ConfigurationFormularyContainer>
    ) : (
        <Styled.Container
        isOpen={props.isSelectConnectionValueOpen}
        >
            <Select
            onOpen={props.setIsSelectConnectionValueOpen}
            />
        </Styled.Container>
    )
}