import { Fragment } from 'react'
import Styled from '../styles'
import FormularyFieldAttachment from '../../Formulary.Field.Attachment'
import FormularyFieldDate from '../../Formulary.Field.Date'
import FormularyFieldNumber from '../../Formulary.Field.Number'
import FormularyFieldText from '../../Formulary.Field.Text'
import FormularyFieldOption from '../../Formulary.Field.Option'
import FormularyFieldConnection from '../../Formulary.Field.Connection'
import FormularyFieldEmail from '../../Formulary.Field.Email'
import FormularyFieldFormula from '../../Formulary.Field.Formula'
import FormularyFieldId from '../../Formulary.Field.Id'
import FormularyFieldLongText from '../../Formulary.Field.LongText'
import FormularyFieldTags from '../../Formulary.Field.Tags'
import FormularyFieldUser from '../../Formulary.Field.User'
import { Switch, strings } from '../../../../core'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { 
    faEllipsisH
} from '@fortawesome/free-solid-svg-icons'

export default function FormularyFieldWebLayout(props) {
    const fieldTypeName = props.retrieveFieldTypeName()
    const customComponentsFieldOptions = Array.isArray(props.optionsForDropdownMenuRef.current) ? 
        props.optionsForDropdownMenuRef.current : []
    const hasCustomOptionComponents = props.numberOfCustomOptionComponents > 0

    return (
        <Styled.Container
        ref={props.fieldRef}
        >   
            {props.isRenaming ? (
                <Styled.LabelNameInput
                fieldIsHidden={props.field.fieldIsHidden}
                autoFocus={true}
                autoComplete={'whathever'}
                onChange={(e) => props.onChangeFieldLabelName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' ? props.setIsRenaming(false) : null}
                value={props.field.labelName}
                />
            ) : props.field.labelIsHidden === false ? (
                <Styled.FieldTitleLabel
                fieldIsHidden={props.field.fieldIsHidden}
                >
                    {props.field.labelName}
                    {props.field.required === true ? '*' : ''}
                </Styled.FieldTitleLabel>
            ) : props.field.labelIsHidden === true && props.field.fieldIsHidden === true ? (
                <Styled.FieldIsHiddenAndLabelIsHiddenMessage>
                    {strings('pt-BR', 'formularyFieldEditLabelAndFieldIsHiddenMessage').replace('{}', props.field.labelName)}
                </Styled.FieldIsHiddenAndLabelIsHiddenMessage>
            ) : ''}
            {props.workspace.isAdmin === true ? (
                <Fragment>
                    <Styled.FieldEditMenu
                    isHovering={props.isHovering}
                    >
                        <Styled.FieldEditButtonMenu
                        ref={props.fieldEditMenuButtonRef}
                        isHovering={props.isHovering}
                        onClick={() => props.onToggleEditFieldMenu(true)}
                        >
                            <FontAwesomeIcon
                            icon={faEllipsisH}
                            />
                        </Styled.FieldEditButtonMenu>
                    </Styled.FieldEditMenu>
                    {props.isEditMenuOpen === true ? (
                        <Styled.FieldEditMenuWrapper>
                            <Styled.FieldEditMenuDropdownContainer
                            ref={props.fieldEditDropdownMenuRef}
                            editMenuPosition={props.editMenuPosition}
                            >
                                <Styled.FieldEditMenuDropdownSwitchContainer
                                onClick={() => props.onChangeFieldIsRequired(!props.field.required)}
                                >
                                    <Switch
                                    isSelected={props.field.required}
                                    onSelect={() => props.onChangeFieldIsRequired(!props.field.required)}
                                    /> 
                                    <Styled.FieldEditMenuDropdownSwitchLabel
                                    disabled={props.field.fieldIsHidden}
                                    >
                                        {strings('pt-BR', 'formularyFieldEditIsRequiredLabel')}
                                    </Styled.FieldEditMenuDropdownSwitchLabel>
                                </Styled.FieldEditMenuDropdownSwitchContainer>
                                <Styled.FieldEditMenuDropdownSwitchContainer
                                onClick={() => props.onChangeLabelIsHidden(!props.field.labelIsHidden)}
                                >
                                    <Switch
                                    isSelected={props.field.labelIsHidden}
                                    onSelect={() => props.onChangeLabelIsHidden(!props.field.labelIsHidden)}
                                    /> 
                                    <Styled.FieldEditMenuDropdownSwitchLabel>
                                        {strings('pt-BR', 'formularyFieldEditLabelIsHiddenLabel')}
                                    </Styled.FieldEditMenuDropdownSwitchLabel>
                                </Styled.FieldEditMenuDropdownSwitchContainer>
                                <Styled.FieldEditMenuDropdownSwitchContainer
                                onClick={() => props.onChangeFieldIsHidden(!props.field.fieldIsHidden)}
                                >
                                    <Switch
                                    isSelected={props.field.fieldIsHidden}
                                    onSelect={() => props.onChangeFieldIsHidden(!props.field.fieldIsHidden)}
                                    /> 
                                    <Styled.FieldEditMenuDropdownSwitchLabel>
                                        {strings('pt-BR', 'formularyFieldEditFieldIsHiddenLabel')}
                                    </Styled.FieldEditMenuDropdownSwitchLabel>
                                </Styled.FieldEditMenuDropdownSwitchContainer>
                                <Styled.FieldEditMenuDropdownSwitchContainer
                                onClick={() => props.onChangeFieldIsUnique(!props.field.isUnique)}
                                >
                                    <Switch
                                    isSelected={props.field.isUnique}
                                    onSelect={() => props.onChangeFieldIsUnique(!props.field.isUnique)}
                                    /> 
                                    <Styled.FieldEditMenuDropdownSwitchLabel>
                                        {strings('pt-BR', 'formularyFieldEditFieldIsUniqueLabel')}
                                    </Styled.FieldEditMenuDropdownSwitchLabel>
                                </Styled.FieldEditMenuDropdownSwitchContainer>
                                <Styled.FieldEditMenuDropdownSwitchContainer
                                onClick={() => props.onTogglePlaceholderInput()}
                                >
                                    <Switch
                                    isSelected={props.isPlaceholderOpen}
                                    onSelect={() => props.onTogglePlaceholderInput()}
                                    /> 
                                    <Styled.FieldEditMenuDropdownSwitchLabel>
                                        {'Texto de ajuda'}
                                    </Styled.FieldEditMenuDropdownSwitchLabel>
                                </Styled.FieldEditMenuDropdownSwitchContainer>
                                {props.isPlaceholderOpen === true ? (
                                    <Styled.FieldEditMenuDropdownPlaceholderInput
                                    type={'text'}
                                    value={typeof(props.field.placeholder) !== 'string' ? '' : props.field.placeholder}
                                    onChange={(e) => props.onChangePlaceholder(e.target.value)}
                                    autoFocus={true}
                                    autoComplete={'whathever'}
                                    />
                                ) : ''}
                                {hasCustomOptionComponents ? (
                                    <Styled.FieldEditMenuDropdownSeparator/>
                                ) : ''}
                                {customComponentsFieldOptions.map(OptionComponent => OptionComponent)}
                                {hasCustomOptionComponents ? (
                                    <Styled.FieldEditMenuDropdownSeparator/>
                                ) : ''}
                                <Styled.FieldEditMenuDropdownButton
                                onClick={() => {
                                    props.onToggleEditFieldMenu(false)
                                    props.setIsRenaming(!props.isRenaming)
                                }}
                                >
                                    {strings('pt-BR', 'formularyFieldEditRenameLabel')}
                                </Styled.FieldEditMenuDropdownButton>
                                <Styled.FieldEditMenuDropdownButton>
                                    {strings('pt-BR', 'formularyFieldEditEditLabel')}
                                </Styled.FieldEditMenuDropdownButton>
                                <Styled.FieldEditMenuDropdownButton
                                onClick={() => props.onDuplicateField(props.field.uuid)}
                                >
                                    {strings('pt-BR', 'formularyFieldEditDuplicateLabel')}
                                </Styled.FieldEditMenuDropdownButton>
                                <Styled.FieldEditMenuDropdownButton
                                onClick={() => props.onRemoveField(props.field.uuid)}
                                isExclude={true}
                                >
                                    {strings('pt-BR', 'formularyFieldEditDeleteLabel')}
                                </Styled.FieldEditMenuDropdownButton>
                            </Styled.FieldEditMenuDropdownContainer>
                        </Styled.FieldEditMenuWrapper>
                    ) : ''}
                </Fragment>
            ) : ''}
            
            {props.field.fieldIsHidden === false ? fieldTypeName === 'text' ? (
                <FormularyFieldText
                {...props}
                />
            ) : fieldTypeName === 'number' ? (
                <FormularyFieldNumber
                {...props}
                />
            ) : fieldTypeName === 'date' ? (
                <FormularyFieldDate
                {...props}
                />
            ) : fieldTypeName === 'option' ? (
                <FormularyFieldOption
                {...props}
                />
            ) : fieldTypeName === 'connection' ? (
                <FormularyFieldConnection
                {...props}
                />
            ) : fieldTypeName === 'attachment' ? (
                <FormularyFieldAttachment
                {...props}
                />
            ) : fieldTypeName === 'long_text' ? (
                <FormularyFieldLongText
                {...props}
                />
            ) : fieldTypeName === 'email' ? (
                <FormularyFieldEmail
                {...props}
                />
            ) : fieldTypeName === 'tags' ? (
                <FormularyFieldTags
                {...props}
                />
            ) : fieldTypeName === 'id' ? (
                <FormularyFieldId
                {...props}
                />
            ) : fieldTypeName === 'user' ? (
                <FormularyFieldUser
                {...props}
                />
            ) : fieldTypeName === 'formula' ? (
                <FormularyFieldFormula
                {...props}
                />
            ) : '' : 
            ''}
        </Styled.Container>
    )
}