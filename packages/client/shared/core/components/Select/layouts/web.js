import Styled from '../styles'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

export default function SelectWebLayout(props) {
    if (props.optionsContainerRef.current && props.selectRef.current) {
        console.log(props.optionsContainerRef.current.getBoundingClientRect().height + props.selectRef.current.getBoundingClientRect().height)

    }
    return (
        <Styled.Container
        ref={props.selectRef}
        >
            <Styled.SearchAndSelectedOptionsContainer
            onClick={() => props.onToggleOpen(!props.isOpen)}
            >
                {props.selectedOptions.map(option => (
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
                ))}
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
                        {props.options.map(option => (
                            <Styled.OptionContainer
                            key={option.value}
                            >
                                <Styled.OptionButton
                                onClick={() => {
                                    props.onSelectOrRemoveOption(option)
                                }}
                                >
                                    {option.label}
                                </Styled.OptionButton>
                            </Styled.OptionContainer>
                        ))}
                    </Styled.OptionsContainer>
                ) : ''}
            </Styled.OptionsContainerWrapper>
        </Styled.Container>
    )
}