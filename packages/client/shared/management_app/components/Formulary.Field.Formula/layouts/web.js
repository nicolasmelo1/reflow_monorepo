import { Fragment } from 'react'
import { strings, Tooltip } from '../../../../core'
import Styled from '../styles'

export default function FormularyFieldFormulaWebLayout(props) {
    const hasValueDefined = !['', null, undefined].includes(props.value)
    const hasPlaceholder = !['', null, undefined].includes(props.field.placeholder)
    
    return (
        <Styled.Container 
        hasTooltip={hasValueDefined === true || (hasValueDefined === false && hasPlaceholder === true)}
        >
            {hasValueDefined === true ? (
                <Styled.TooltipWrapper>
                    <Tooltip
                    text={strings('formularyFieldFormulaDescriptionLabel')}
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
                            text={strings('formularyFieldFormulaEmptyValueDescriptionLabel')}
                            >
                                <Styled.Description>
                                    {props.field.placeholder}
                                </Styled.Description>
                            </Tooltip>
                        </Styled.TooltipWrapper>
                    ) : (
                        <div ref={props.editorRef}/>
                    )}
                </Fragment>
            )}
        </Styled.Container>
    )
}