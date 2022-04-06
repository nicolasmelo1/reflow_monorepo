import { Fragment } from 'react'
import { Switch, strings } from '../../../../core'
import Styled from '../styles'

export default function FieldEditDropdownMenuWebLayout(props) {
    const fieldType = props.getTypesById()[props.field.fieldTypeId]
    
    const hasCustomOptionComponents = typeof props.componentOptionForDropdownMenuRef === 'object' &&
        ![null, undefined].includes(props.componentOptionForDropdownMenuRef.current)
    const CustomComponentFieldOptions = hasCustomOptionComponents ? 
        props.componentOptionForDropdownMenuRef.current : null

    return (
        <Fragment>
            {props.isEditMenuOpen === true ? (
                <Styled.MenuWrapper>
                    <Styled.MenuDropdownContainer
                    ref={props.fieldEditDropdownMenuRef}
                    editMenuPosition={props.editMenuPosition}
                    >   
                        {fieldType.canBeRequired === true ? (
                            <Styled.MenuDropdownSwitchContainer
                            onClick={() => props.onChangeFieldIsRequired(!props.field.required)}
                            >
                                <Switch
                                isSelected={props.field.required}
                                onSelect={() => props.onChangeFieldIsRequired(!props.field.required)}
                                /> 
                                <Styled.MenuDropdownSwitchLabel
                                disabled={props.field.fieldIsHidden}
                                >
                                    {strings('formularyFieldEditIsRequiredLabel')}
                                </Styled.MenuDropdownSwitchLabel>
                            </Styled.MenuDropdownSwitchContainer>
                        ) : null}
                        {fieldType.canLabelBeHidden === true ? (
                            <Styled.MenuDropdownSwitchContainer
                            onClick={() => props.onChangeLabelIsHidden(!props.field.labelIsHidden)}
                            >
                                <Switch
                                isSelected={props.field.labelIsHidden}
                                onSelect={() => props.onChangeLabelIsHidden(!props.field.labelIsHidden)}
                                /> 
                                <Styled.MenuDropdownSwitchLabel>
                                    {strings('formularyFieldEditLabelIsHiddenLabel')}
                                </Styled.MenuDropdownSwitchLabel>
                            </Styled.MenuDropdownSwitchContainer>
                        ) : null}
                        {fieldType.canFieldBeHidden === true ? (
                            <Styled.MenuDropdownSwitchContainer
                            onClick={() => props.onChangeFieldIsHidden(!props.field.fieldIsHidden)}
                            >
                                <Switch
                                isSelected={props.field.fieldIsHidden}
                                onSelect={() => props.onChangeFieldIsHidden(!props.field.fieldIsHidden)}
                                /> 
                                <Styled.MenuDropdownSwitchLabel>
                                    {strings('formularyFieldEditFieldIsHiddenLabel')}
                                </Styled.MenuDropdownSwitchLabel>
                            </Styled.MenuDropdownSwitchContainer>
                        ) : null}
                        {fieldType.canBeUnique === true ? (
                            <Styled.MenuDropdownSwitchContainer
                            onClick={() => props.onChangeFieldIsUnique(!props.field.isUnique)}
                            >
                                <Switch
                                isSelected={props.field.isUnique}
                                onSelect={() => props.onChangeFieldIsUnique(!props.field.isUnique)}
                                /> 
                                <Styled.MenuDropdownSwitchLabel>
                                    {strings('formularyFieldEditFieldIsUniqueLabel')}
                                </Styled.MenuDropdownSwitchLabel>
                            </Styled.MenuDropdownSwitchContainer>
                        ) : null}
                        {fieldType.hasPlaceholder === true ? (
                            <Fragment>
                                <Styled.MenuDropdownSwitchContainer
                                onClick={() => props.onTogglePlaceholderInput()}
                                >
                                    <Switch
                                    isSelected={props.isPlaceholderOpen}
                                    onSelect={() => props.onTogglePlaceholderInput()}
                                    /> 
                                    <Styled.MenuDropdownSwitchLabel>
                                        {'Texto de ajuda'}
                                    </Styled.MenuDropdownSwitchLabel>
                                </Styled.MenuDropdownSwitchContainer>
                                {props.isPlaceholderOpen === true ? (
                                    <Styled.MenuDropdownPlaceholderInput
                                    type={'text'}
                                    value={typeof(props.field.placeholder) !== 'string' ? '' : props.field.placeholder}
                                    onChange={(e) => props.onChangePlaceholder(e.target.value)}
                                    autoFocus={true}
                                    autoComplete={'off'}
                                    />
                                ) : ''}
                            </Fragment>
                        ) : null}
                        {hasCustomOptionComponents ? (
                            <CustomComponentFieldOptions
                            {...props.customOptionForDropdownMenuProps}
                            />
                        ) : ''}
                        {fieldType.hasValues === true ? (
                            <Styled.MenuDropdownButton
                            onClick={() => {
                                props.onToggleEditFieldMenu(false)
                                props.onToggleIsRenaming(!props.isRenaming)
                            }}
                            >
                                {strings('formularyFieldEditRenameLabel')}
                            </Styled.MenuDropdownButton>
                        ) : null}
                        <Styled.MenuDropdownButton>
                            {strings('formularyFieldEditEditLabel')}
                        </Styled.MenuDropdownButton>
                        <Styled.MenuDropdownButton
                        onClick={() => {
                            props.onToggleEditFieldMenu(false)
                            props.onDuplicateField(props.field)
                        }}
                        >
                            {strings('formularyFieldEditDuplicateLabel')}
                        </Styled.MenuDropdownButton>
                        <Styled.MenuDropdownButton
                        onClick={() => props.onRemoveField(props.field)}
                        isExclude={true}
                        >
                            {strings('formularyFieldEditDeleteLabel')}
                        </Styled.MenuDropdownButton>
                    </Styled.MenuDropdownContainer>
                </Styled.MenuWrapper>
            ) : null}
        </Fragment>
    )
}
