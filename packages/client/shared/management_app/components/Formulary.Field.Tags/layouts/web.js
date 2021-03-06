import { Switch, Select, strings, colors } from '../../../../core'
import { faArrowUp, faArrowDown, faEllipsisH, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import Styled from '../styles'

// ------------------------------------------------------------------------------------------
export function DropdownMenuTagsFormatOptionWebLayout(props) {
    return (
        <Styled.DropdownMenuInputContainer>
            <Switch
            isSelected={props.isDropdown}
            onSelect={() => props.onChangeIfIsDropdownMenu(!props.isDropdown)}
            /> 
            <Styled.SwitchFieldLabel>
                {strings('formularyFieldOptionDropdownMenuIsDropdownLabel')}
            </Styled.SwitchFieldLabel>
        </Styled.DropdownMenuInputContainer>
    )
}
// ------------------------------------------------------------------------------------------
export function CustomCreateOptionButtonWebLayout(props) {
    return (
        <Styled.SelectContainerOnDropdown>
            <Styled.SelectButton
            onClick={() => props.onCreateOption(props.color)}
            >
                {strings('formularyFieldOptionCreateOptionLabel')}
                <Styled.CreateOptionLabel
                color={props.color}
                >
                    {props.value}
                </Styled.CreateOptionLabel>
            </Styled.SelectButton>
        </Styled.SelectContainerOnDropdown>
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
    const SelectContainer = props.isADropdownMenu === true ? 
        Styled.SelectContainerOnDropdown : 
        Styled.SelectContainerWithoutDropdown

    return (
        <SelectContainer
        isSelected={props.isSelected}
        isLast={props.option.isLast}
        color={props.option.color}
        onMouseOver={() => props.onHoverOption(true)}
        onMouseLeave={() => props.onHoverOption(false)}
        >   
            {props.isADropdownMenu === false ? (
                <Styled.CheckboxInput 
                type={'checkbox'}
                onChange={() => props.onSelectOrRemoveOption(props.option)}
                name={props.field.label.name}
                />
            ) : ''}
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
                isADropdownMenu={props.isADropdownMenu}
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
        </SelectContainer>
    )
}
// ------------------------------------------------------------------------------------------
export default function FormularyFieldTagsWebLayout(props) {
    const isADropdownMenu = typeof props.field?.tagsField?.isDropdown === 'boolean' ? props.field.tagsField.isDropdown : true
    const TagOptionComponent = props.customOptionComponent.customOption
    
    return isADropdownMenu === true ? (
        <Styled.Container
        isOpen={props.isOpen}
        >
            <Select
            multiple={true}
            creatable={props.isUserAnAdmin}
            customProps={props.customOptionComponentProps}
            customHelperLabel={props.isUserAnAdmin === true ? 
                strings('formularyFieldOptionCustomHelperLabelIfIsAdmin') : 
                strings('formularyFieldOptionCustomHelperLabelIfIsNotAdmin')}
            customCreateOptionComponent={props.customCreateOptionComponent}
            selectedComponent={props.customSelectedComponent}
            optionComponent={props.customOptionComponent}
            onCreateOption={props.onCreateOption}
            onOpen={props.onOpenSelect}
            isOpen={props.isOpen}
            options={props.options}
            placeholder={props.field.placeholder}
            />
        </Styled.Container>
    ) : (
        <Styled.NotADropdownContainer>
            {props.options.map(option => (
                <TagOptionComponent
                key={option.value}
                isSelected={option.label === 'Python' || option.label === 'Javascript'}
                isADropdownMenu={isADropdownMenu}
                option={option}
                onSelectOrRemoveOption={props.onSelectOption}
                {...props.customOptionComponentProps}
                />
            ))}
        </Styled.NotADropdownContainer>
    )
}