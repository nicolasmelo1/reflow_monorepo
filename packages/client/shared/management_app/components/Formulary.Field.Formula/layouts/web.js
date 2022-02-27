import { Fragment } from 'react'
import { strings, Tooltip } from '../../../../core'
import FlowCodeEditor from '../../../../flow/components/FlowCodeEditor'
import Styled from '../styles'

export default function FormularyFieldFormulaWebLayout(props) {
    const hasValueDefined = !['', null, undefined].includes(props.value)
    const hasPlaceholder = !['', null, undefined].includes(props.field.placeholder)
    
    return (
        <Styled.Container 
        ref={props.editorContainerRef}
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
                        <div>
                            <FlowCodeEditor
                            onAutoComplete={props.onAutoComplete}
                            onAutocompleteFunctionOrModule={props.onAutocompleteFunctionOrModule}
                            getFlowContext={props.getFlowContext}
                            onBlur={props.onBlur}
                            onFocus={props.onFocus}
                            onChange={props.onChangeFormula}
                            functionsRef={props.codeEditorFunctionsRef}
                            />
                            {props.autocompleteOptions.length > 0 ? (
                                <div
                                style={{width: '100%'}}
                                >
                                    {props.autocompleteOptions.map((option, index) => (
                                        <div
                                        key={index}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            props.onClickAutocomplete(option.label)}
                                        }
                                        style={{
                                            userSelect: 'none',
                                            display:'flex',
                                            flexDirection: 'row',
                                            backgroundColor: 'gray',
                                            cursor: 'pointer'
                                        }}
                                        >
                                            <p style={{fontWeight: 'bold'}}>
                                                {option.label}
                                            </p>
                                            <p>
                                                {option.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : ''}
                        </div>
                    )}
                </Fragment>
            )}
        </Styled.Container>
    )
}