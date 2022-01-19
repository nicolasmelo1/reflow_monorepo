import Styled from '../styles'

export default function SelectWebLayout(props) {
    return (
        <Styled.Container
        ref={props.selectRef}
        >
            <Styled.SearchAndSelectedOptionsContainer
            onClick={() => {
                props.onToggleOpen(!props.isOpen)
                props.searchInputRef.current.focus()
            }}
            >
                <Styled.SearchInput
                ref={props.searchInputRef}
                type={'text'}
                value={props.search}
                onInput={(e) => props.adjustWidthOfSearchInput(e.target.value)}
                onChange={(e) => props.onSearch(e.target.value)}
                inputWidth={props.searchInputWidth}
                />
            </Styled.SearchAndSelectedOptionsContainer>
            <Styled.OptionsContainerWrapper>
                {props.isOpen ? (
                    <Styled.OptionsContainer>
                        {props.options.map((option, index) => (
                            <div
                            key={index}
                            >
                                {option.label}
                            </div>
                        ))}
                    </Styled.OptionsContainer>
                ) : ''}
            </Styled.OptionsContainerWrapper>
        </Styled.Container>
    )
}