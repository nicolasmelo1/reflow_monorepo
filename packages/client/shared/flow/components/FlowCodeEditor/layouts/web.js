import { useEffect, Fragment } from 'react'
import { useFlowCodemirror } from "../../../hooks"
import Styled from '../styles'

/**
 * This will load the useFlowCodemirror in the component passing all of the props recieved from
 * the parent component.
 * 
 * The useFlowCodemirror returns actions that we can use in the parent component. Those actions become available
 * if you send a `functionsRef`. We will append those actions in this ref and then in the parent component
 * you are able to call for example:
 * ```
 * functionsRef.current.dispatchChange('To Add on Codemirror editor')
 * ```
 */
export default function FlowWebCodeEditor(props) {
    const { 
        editorRef, dispatchChange, forceFocus, forceBlur
    } = useFlowCodemirror({
        onAutoComplete: props.onAutoComplete,
        onAutocompleteFunctionOrModule: props.onAutocompleteFunctionOrModule,
        getFlowContext: props.getFlowContext,
        onBlur: props.onBlur,
        onFocus: props.onFocus,
        onChange: props.onChange,
        onSelect: props.onSelect
    })
    
    useEffect(() => {
        if (props.functionsRef !== undefined) {
            props.functionsRef.current = {
                dispatchChange,
                forceFocus,
                forceBlur
            }
        }
    }, [dispatchChange, forceFocus, forceBlur])
    
    return (
        <div
        ref={props.editorContainerRef}
        >
            <div ref={editorRef}/>
            <Styled.AutocompleteAndFunctionOrModuleDescriptionContainer>
                {props.autocompleteModulesOrFunctions !== null ? (
                    <Styled.FunctionOrModuleDescriptionContainer>
                        <Styled.FunctionOrModuleDescriptionTitle>
                            <Styled.FunctionOrModuleDescriptionTitleText>
                                {props.autocompleteModulesOrFunctions.method.name}
                            </Styled.FunctionOrModuleDescriptionTitleText>
                            <Styled.FunctionOrModuleDescriptionTitleText>
                                {'('}
                            </Styled.FunctionOrModuleDescriptionTitleText>
                            {(typeof props.autocompleteModulesOrFunctions.method?.parameters === 'object' ? 
                                Object.values(props.autocompleteModulesOrFunctions.method.parameters) : []).map((parameter, index) => (
                                    <Fragment 
                                    key={index}
                                    >
                                        <Styled.FunctionOrModuleDescriptionTitleText 
                                        isParameter={true}
                                        isSelected={props.autocompleteModulesOrFunctions.currentParameter !== undefined ? 
                                            parameter.name === props.autocompleteModulesOrFunctions.currentParameter.name : false}
                                        >
                                            <span>
                                                {parameter.name}
                                            </span>
                                            {parameter.required === true ? (
                                                <Styled.FunctionOrModuleDescriptionTitleTextIsRequired>
                                                    {'*'}
                                                </Styled.FunctionOrModuleDescriptionTitleTextIsRequired>
                                            ) : null}
                                        </Styled.FunctionOrModuleDescriptionTitleText>
                                        {index !== Object.keys(props.autocompleteModulesOrFunctions.method.parameters).length - 1 ? (
                                            <Styled.FunctionOrModuleDescriptionTitleText
                                            isToAddMargin={true}
                                            >
                                                {', '}
                                            </Styled.FunctionOrModuleDescriptionTitleText>
                                        ) : null}
                                    </Fragment>
                                ))}
                            <Styled.FunctionOrModuleDescriptionTitleText>
                                {')'}
                            </Styled.FunctionOrModuleDescriptionTitleText>
                        </Styled.FunctionOrModuleDescriptionTitle>
                        <Styled.FunctionOrModuleDescription>
                            {props.autocompleteModulesOrFunctions.currentParameter !== undefined ? 
                                props.autocompleteModulesOrFunctions?.currentParameter.description : 
                                props.autocompleteModulesOrFunctions?.method.description
                            }
                        </Styled.FunctionOrModuleDescription>
                    </Styled.FunctionOrModuleDescriptionContainer>
                ) : null}
                {props.autocompleteOptions.length > 0 ? (
                    <Styled.AutocompleteContainer>
                        <Styled.AutocompleteOptionsContainer>
                            {props.autocompleteOptions.map((option, index) => (
                                <Styled.AutocompleteOptionContainer
                                key={index}
                                isLast={index === props.autocompleteOptions.length - 1}
                                onClick={(e) => {
                                    if (option.cursorOffset) {
                                        props.onClickAutocomplete(option.autocompleteText, { cursorAt: option.cursorOffset}) 
                                    } else if (option.isSnippet === true) {
                                        props.onClickAutocomplete(option.autocompleteText, { isSnippet: true })
                                    } else {
                                        props.onClickAutocomplete(option.autocompleteText)
                                    }
                                }}
                                >
                                    <Styled.AutocompleteOptionText>
                                        {option.label}
                                    </Styled.AutocompleteOptionText>
                                </Styled.AutocompleteOptionContainer>
                            ))}
                        </Styled.AutocompleteOptionsContainer>
                        <Styled.AutocompleteDescriptionContainer>

                        </Styled.AutocompleteDescriptionContainer>
                    </Styled.AutocompleteContainer>
                ) : ''}
            </Styled.AutocompleteAndFunctionOrModuleDescriptionContainer>
        </div>
    )
}