import { Fragment } from 'react'
import { faCog, faCheck } from '@fortawesome/free-solid-svg-icons'
import { strings, Tooltip } from '../../../../core'
import FlowCodeEditor from '../../../../flow/components/FlowCodeEditor'
import Styled from '../styles'

export function DropdownMenuFormulaFormatOptionWebLayout(props) {
    return (
        <Styled.DropdownMenuInputContainer>
            <Styled.IsToEditFormulaButton
            onClick={() => props.onEditFormula()}
            >
                <Styled.IsToEditFormulaButtonIcon 
                icon={props.isEditingFormula === true ? faCheck : faCog}
                />
                {props.isEditingFormula === true ? 
                    strings('formularyFieldFormulaDropdownMenuToFinishEditOnFormulaLabel') : 
                    strings('formularyFieldFormulaDropdownMenuToEditFormulaLabel')}
            </Styled.IsToEditFormulaButton>
        </Styled.DropdownMenuInputContainer>
    )
}

export default function FormularyFieldFormulaWebLayout(props) {
    const hasValueDefined = !['', null, undefined].includes(props.value)
    const hasPlaceholder = !['', null, undefined].includes(props.field.placeholder)

    return (
        <Styled.Container 
        ref={props.editorContainerRef}
        hasTooltip={hasValueDefined === true || (hasValueDefined === false && hasPlaceholder === true)}
        >
            {props.isEditingFormula === true ? (
                <Fragment>
                    <FlowCodeEditor
                    code={props.formula}
                    onChange={props.onChangeFormula}
                    onAutoComplete={props.onAutocomplete}
                    evaluateRef={props.evaluateRef}
                    flowServiceRef={props.flowServiceRef}
                    />
                    <Styled.DoneButtonContainer>
                        <Styled.DoneEditingButton
                        onClick={() => props.onToggleIsEditingFormula(false)}
                        >
                            {strings('formularyFieldFormulaDoneEditingFormula')}
                        </Styled.DoneEditingButton>
                    </Styled.DoneButtonContainer>
                </Fragment>

            ) : (
                <Fragment>
                    {hasValueDefined === true ? (
                        <Styled.TooltipWrapper>
                            <Tooltip
                            text={hasPlaceholder === true ? 
                                props.field.placeholder :
                                strings('formularyFieldFormulaDescriptionLabel')
                            }
                            >
                                <Styled.Value>
                                    {props.value}
                                </Styled.Value>
                            </Tooltip>
                        </Styled.TooltipWrapper>
                    ) : (
                        <Fragment>
                            <Styled.TooltipWrapper>
                                <Styled.Description>
                                    {hasPlaceholder === true ? 
                                        props.field.placeholder : 
                                        strings('formularyFieldFormulaDescriptionLabel')}
                                </Styled.Description>
                            </Styled.TooltipWrapper>
                        </Fragment>
                    )}
                </Fragment>
            )}
        </Styled.Container>
    )
}