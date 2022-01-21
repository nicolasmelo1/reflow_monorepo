import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { strings } from '../../../utils/constants'
import Styled from '../styles'

export default function SelectWebLayout(props) {
    const CustomCreateOption = props.customCreateOptionComponent !== undefined ? props.customCreateOptionComponent : undefined

    return (
        <Styled.Container
        ref={props.selectRef}
        >
            <Styled.SearchAndSelectedOptionsContainer
            onClick={() => props.onToggleOpen(!props.isOpen)}
            >
                {props.selectedOptions.map(option => {
                    const CustomSelectedComponet = props.selectedComponents !== undefined && 
                        props.selectedComponents[option.selectedComponent] !== undefined ? 
                        props.selectedComponents[option.selectedComponent] :
                        null
                    
                    return CustomSelectedComponet !== null ? (
                        <CustomSelectedComponet 
                        key={option.value}
                        option={option}
                        onSelectOrRemoveOption={props.onSelectOrRemoveOption}
                        {...props.customProps}
                        />
                    ) : (
                        <Styled.SelectedOption
                        key={option.value}
                        >
                            <Styled.SelectedOptionLabel>
                                {option.label}
                            </Styled.SelectedOptionLabel>
                            <Styled.SelectedOptionRemoveButton
                            onClick={(e) => {
                                e.stopPropagation()
                                props.onSelectOrRemoveOption(option)
                            }}
                            >
                                <Styled.SelectedOptionRemoveButtonIcon
                                icon={faTimes}
                                />
                            </Styled.SelectedOptionRemoveButton>
                        </Styled.SelectedOption>
                    )
                })}
                {props.isDisabled === true ? '' :(
                    <Styled.SearchInput
                    ref={props.searchInputRef}
                    type={'text'}
                    value={props.search}
                    placeholder={props.selectedOptions.length === 0 ? props.placeholder : ''}
                    onClick={(e) => {
                        if (props.isOpen) e.stopPropagation()
                    }}
                    onInput={(e) => props.adjustWidthOfSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Backspace' && props.search === '' && props.selectedOptions.length > 0) {
                            props.onSelectOrRemoveOption(props.selectedOptions[props.selectedOptions.length - 1])
                        }
                    }}
                    onChange={(e) => props.onSearch(e.target.value)}
                    inputWidth={props.searchInputWidth}
                    />
                )}
            </Styled.SearchAndSelectedOptionsContainer>
            <Styled.OptionsContainerWrapper>
                {props.isOpen ? (
                    <Styled.OptionsContainer
                    ref={props.optionsContainerRef}
                    offset={props.optionsContainerOffset}
                    isToLoadOptionsOnBottom={props.isToLoadOptionsOnBottom}
                    >
                        {![null, undefined].includes(props.customHelperLabel) ? (
                            <Styled.HelperContainer>
                                <Styled.HelperLabel>
                                    {props.customHelperLabel}
                                </Styled.HelperLabel>
                            </Styled.HelperContainer>
                        ) : ''}
                        {props.options.map(option => {
                            const CustomOptionComponent = props.optionComponents !== undefined && 
                                props.optionComponents[option.optionComponent] !== undefined ? 
                                props.optionComponents[option.optionComponent] :
                                null

                            return CustomOptionComponent !== null ? (
                                <CustomOptionComponent 
                                key={option.value}
                                option={option}
                                onSelectOrRemoveOption={props.onSelectOrRemoveOption}
                                {...props.customProps}
                                />
                            ) : (
                                <Styled.OptionContainer
                                key={option.value}
                                >
                                    <Styled.OptionButton
                                    onClick={() => props.onSelectOrRemoveOption(option)}
                                    >
                                        {option.label}
                                    </Styled.OptionButton>
                                </Styled.OptionContainer>
                            )
                        })}
                        {props.isToShowCreatable ? 
                        ![null, undefined].includes(CustomCreateOption) ? (
                            <CustomCreateOption
                            onCreateOption={props.onCreateOption}
                            search={props.search}
                            {...props.customProps}
                            />
                        ) : (
                            <Styled.OptionContainer>
                                <Styled.CreateOptionButton
                                onClick={() => props.onCreateOption()}
                                >
                                    {strings('pt-BR', 'selectCreateLabel')}
                                    <Styled.CreateOptionElement>
                                        {props.search}
                                    </Styled.CreateOptionElement>
                                </Styled.CreateOptionButton>
                            </Styled.OptionContainer>
                        ) : ''}
                    </Styled.OptionsContainer>
                ) : ''}
            </Styled.OptionsContainerWrapper>
        </Styled.Container>
    )
}