import { Fragment } from 'react'
import { strings, Tooltip } from '../../../../core'
import Styled from '../styles'

export default function FormularyFieldIdWebLayout(props) {
    const hasValueDefined = !['', null, undefined].includes(props.value)
    const hasPlaceholder = !['', null, undefined].includes(props.field.placeholder)
    
    return (
        <Styled.Container 
        hasTooltip={hasValueDefined === true || (hasValueDefined === false && hasPlaceholder === true)}
        >
            {hasValueDefined === true ? (
                <Styled.TooltipWrapper>
                    <Tooltip
                    text={strings('formularyFieldIdDescriptionLabel')}
                    >
                        <Styled.Value>
                            {props.value}
                        </Styled.Value>
                    </Tooltip>
                </Styled.TooltipWrapper>
            ) : (
                <Fragment>
                    {hasPlaceholder === true ? (
                        <Styled.TooltipWrapper>
                            <Tooltip
                            text={strings('formularyFieldIdDescriptionLabel')}
                            >
                                <Styled.Description>
                                    {props.field.placeholder}
                                </Styled.Description>
                            </Tooltip>
                        </Styled.TooltipWrapper>
                    ) : (
                        <Styled.Description>
                            {strings('formularyFieldIdDescriptionLabel')}
                        </Styled.Description>
                    )}
                </Fragment>
            )}
        </Styled.Container>
    )
}