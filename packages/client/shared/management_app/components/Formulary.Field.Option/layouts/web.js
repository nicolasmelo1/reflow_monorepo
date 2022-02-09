import { Select, strings, colors } from '../../../../core'
import { faArrowUp, faArrowDown, faEllipsisH, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import Styled from '../styles'

// ------------------------------------------------------------------------------------------
export function CustomCreateOptionButtonWebLayout(props) {
    return (
        <Styled.SelectContainer>
            <Styled.SelectButton
            onClick={() => props.onCreateOption()}
            >
                {strings('formularyFieldOptionCreateOptionLabel')}
                <Styled.CreateOptionLabel>
                    {props.value}
                </Styled.CreateOptionLabel>
            </Styled.SelectButton>
        </Styled.SelectContainer>
    )
}
// ------------------------------------------------------------------------------------------
export function CustomSelectedOptionWebLayout(props) {
    return (
        <Styled.SelectedOption
        color={props.option.color}
        >
            <Styled.SelectedOptionLabel
            color={props.option.color}
            >
                {props.option.label}
            </Styled.SelectedOptionLabel>
            <Styled.SelectedOptionRemoveButton
            onClick={(e) => {
                e.stopPropagation()
                props.onSelectOrRemoveOption(props.option)
            }}
            >
                <Styled.SelectedOptionRemoveButtonIcon
                color={props.option.color}
                icon={faTimes}
                />
            </Styled.SelectedOptionRemoveButton>
        </Styled.SelectedOption>
    )
}
// ------------------------------------------------------------------------------------------
export function CustomOptionSelectWebLayout(props) {
    return (
        <Styled.SelectContainer
        onMouseOver={() => props.onHoverOption(true)}
        onMouseLeave={() => props.onHoverOption(false)}
        >   
            {props.isRenaming ? (
                <Styled.RenameInput
                ref={props.renameOptionInputRef}
                type={'text'}
                autoComplete={'off'}
                autoFocus={true}
                value={props.option.label}
                onChange={(e) => props.onChangeOptionLabel(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' ? props.onToggleRenaming(false) : null}
                />
            ) : (
                <Styled.SelectButton
                color={props.option.color}
                onClick={() => props.onSelectOrRemoveOption(props.option)}
                >
                    {props.option.label}
                </Styled.SelectButton>
            )}
            {props.isUserAnAdmin === true ? props.isRenaming ? (
                <Styled.SelectHelperButtonsContainer
                isHovering={props.isHovering}
                >
                    <Styled.SelectHelperButtons
                    onClick={() => props.onToggleRenaming(false)}
                    >
                        <Styled.SelectHelperButtonIcon
                        color={props.option.color}
                        icon={faCheck}
                        />
                    </Styled.SelectHelperButtons>
                </Styled.SelectHelperButtonsContainer>
            ) : (
                <Styled.SelectHelperButtonsContainer
                isHovering={props.isHovering}
                >
                    {props.option.index !== 0 ? (
                        <Styled.SelectHelperButtons
                        onClick={() => {
                            props.onHoverOption(false)
                            props.onMoveOptionUp(props.option.value)
                        }}
                        >
                            <Styled.SelectHelperButtonIcon
                            color={props.option.color}
                            icon={faArrowUp}
                            />
                        </Styled.SelectHelperButtons>
                    ) : ''}
                    {props.option.isLast ? '' : (
                        <Styled.SelectHelperButtons
                        onClick={() => {
                            props.onHoverOption(false)
                            props.onMoveOptionDown(props.option.value)
                        }}
                        >
                            <Styled.SelectHelperButtonIcon
                            color={props.option.color}
                            icon={faArrowDown}
                            />
                        </Styled.SelectHelperButtons>
                    )}
                    <Styled.SelectHelperButtons
                    ref={props.editOptionButtonRef}
                    onClick={() => props.onToggleEditing()}
                    >
                        <Styled.SelectHelperButtonIcon
                        color={props.option.color}
                        icon={faEllipsisH}
                        />
                    </Styled.SelectHelperButtons>
                    {props.isEditing ? (
                        <Styled.EditOptionMenuOverlay>
                            <Styled.EditOptionMenuContainer
                            ref={props.editMenuContainerRef}
                            editMenuPosition={props.editMenuPosition}
                            >
                                <Styled.EditOptionMenuButton
                                onClick={() => props.onToggleRenaming(true)}
                                >
                                    {strings('formularyFieldOptionEditOptionMenuRenameButtonLabel')}
                                </Styled.EditOptionMenuButton>
                                <Styled.EditOptionMenuButton
                                isExclude={true}
                                onClick={() => props.onRemoveOption(props.option.value)}
                                >
                                    {strings('formularyFieldOptionEditOptionMenuDeleteButtonLabel')}
                                </Styled.EditOptionMenuButton>
                                <Styled.ColorsSelectorWrapper>
                                    <Styled.ColorsSelectorTitle>
                                        {strings('formularyFieldOptionEditOptionMenuColorLabel')}
                                    </Styled.ColorsSelectorTitle>
                                    <Styled.ColorsSelectorContainer>
                                        {colors.map(color => (
                                            <Styled.ColorButton
                                            key={color}
                                            color={color}
                                            onClick={() => props.onChangeOptionColor(color)}
                                            />
                                        ))}
                                    </Styled.ColorsSelectorContainer>
                                </Styled.ColorsSelectorWrapper>
                            </Styled.EditOptionMenuContainer>
                        </Styled.EditOptionMenuOverlay>
                    ) : ''}
                </Styled.SelectHelperButtonsContainer>
            ) : ''}
        </Styled.SelectContainer>
    )
}
// ------------------------------------------------------------------------------------------
export default function FormularyFieldOptionWebLayout(props) {
    return (
        <Styled.Container
        isOpen={props.isOpen}
        >
            <Select
            creatable={props.isUserAnAdmin}
            customProps={props.customOptionComponentProps}
            customHelperLabel={props.isUserAnAdmin === true ? 
                strings('formularyFieldOptionCustomHelperLabelIfIsAdmin') : 
                strings('formularyFieldOptionCustomHelperLabelIfIsNotAdmin')}
            customCreateOptionComponent={props.customCreateOptionComponent}
            selectedComponents={props.customSelectedComponent}
            optionComponents={props.customOptionComponent}
            onCreateOption={props.onCreateOption}
            onOpen={props.onOpenSelect}
            isOpen={props.isOpen}
            options={props.options}
            placeholder={props.field.placeholder}
            />
        </Styled.Container>
    )
}