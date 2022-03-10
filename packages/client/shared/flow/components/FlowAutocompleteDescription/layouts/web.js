import { Fragment } from 'react'
import { useFlowCodemirror } from '../../../hooks'
import { strings } from '../../../../core'
import Styled from '../styles'

function FlowExampleCode(props) {
    const { editorRef } = useFlowCodemirror({
        code: props.code,
        getFlowContext: props.getFlowContext,
        isEditable: false,
        isWithLineCounter: false,
        isWithActiveLine: false
    })

    return (
        <div
        style={{
            borderRadius: '5px',
            border: '1px solid #ccc',
        }}
        >
            <div ref={editorRef}/>
        </div>
    )
}

export default function FlowAutocompleteDescriptionWebLayout(props) {
    const hasParameters = props.parameters.length > 0 
    const hasExamples = props.examples.length > 0
    return (
        <Styled.Container>
            <Styled.TitleContainer>
                {hasParameters ? (
                    <Fragment>
                        <Styled.TitleContents>
                            {props.label}
                        </Styled.TitleContents>
                        <Styled.TitleContents>
                            {'('}
                        </Styled.TitleContents>
                        {props.parameters.map((parameter, index) => (
                            <Fragment
                            key={parameter.name}
                            >
                                <Styled.TitleContents
                                isParameter={true}
                                >
                                    {parameter.name}
                                </Styled.TitleContents>
                                {parameter.required === true ? (
                                    <Styled.TitleIsRequiredParameter>
                                        {'*'}
                                    </Styled.TitleIsRequiredParameter>
                                ) : null}
                                {index < props.parameters.length - 1 ? (
                                    <Styled.TitleContents
                                    isToAddMargin={true}
                                    >
                                        {','}
                                    </Styled.TitleContents>
                                ) : null}
                            </Fragment>
                        ))}
                        <Styled.TitleContents>
                            {')'}
                        </Styled.TitleContents>
                    </Fragment>
                ) : (
                    <Styled.Title>
                        {props.label}
                    </Styled.Title>
                )}
            </Styled.TitleContainer>
            <Styled.MenuTitle>
                {strings('flowDescriptionDescriptionLabel')}
            </Styled.MenuTitle>
            <Styled.Description>
                {props.description}
            </Styled.Description>
            {hasExamples ? (
                <Styled.MenuTitle>
                    {strings('flowDescriptionExampleLabel')}
                </Styled.MenuTitle>
            ) : null}
            {props.examples.map((example, index) => (
                <FlowExampleCode
                key={index}
                code={example}
                getFlowContext={props.getFlowContext}
                />
            ))}
            {hasParameters ? (
                <Styled.MenuTitle>
                    {strings('flowDescriptionParametersLabel')}
                </Styled.MenuTitle>
            ) : null}
            {props.parameters.map((parameter, index) => (
                <Styled.ParameterDescriptionContainer
                key={parameter.name}
                >
                    <Styled.ParameterName>
                        {parameter.name}
                    </Styled.ParameterName>
                    {parameter.required === true ? (
                        <Styled.TitleIsRequiredParameter>
                            {'*'}
                        </Styled.TitleIsRequiredParameter>
                    ) : null}
                    <span
                    style={{ margin: '0 5px', fontWeight: 'bold'}}
                    >
                        {':'}
                    </span>
                    <Styled.ParameterDescription>
                        {parameter.description}
                    </Styled.ParameterDescription>
                </Styled.ParameterDescriptionContainer>
            ))}
        </Styled.Container>
    )
}