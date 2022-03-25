import { Fragment } from 'react'
import Styled from '../styles'
import FormularyFieldAttachment from '../../Formulary.Field.Attachment'
import FormularyFieldCheckbox from '../../Formulary.Field.Checkbox'
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
import FormularyFieldMultiField from '../../Formulary.Field.MultiField'
import FormularyFieldHeading from '../../Formulary.Field.Heading'
import { Switch, strings } from '../../../../core'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { 
    faEllipsisH
} from '@fortawesome/free-solid-svg-icons'

export default function FormularyFieldWebLayout(props) {
    const fieldType = props.getTypesById()[props.field.fieldTypeId]
    const fieldTypeName = typeof fieldType?.name === 'string' ? fieldType.name : ''
    const CustomComponentFieldOptions = ![null, undefined].includes(props.optionForDropdownMenuRef.current) ? 
        props.optionForDropdownMenuRef.current : null
    const hasCustomOptionComponents = ![null, undefined].includes(props.optionForDropdownMenuRef.current)

    return (
        <Styled.Container
        ref={props.fieldRef}
        >   
            {fieldType.hasValues === true ? props.isRenaming ? (
                <Styled.LabelNameInput
                fieldIsHidden={props.field.fieldIsHidden}
                autoFocus={true}
                autoComplete={'off'}
                onFocus={(e) => props.isNewField ? e.target.select() : null}
                onChange={(e) => props.onChangeFieldLabelName(e.target.value)}
                onBlur={() => props.setIsRenaming(false)}
                onKeyPress={(e) => e.key === 'Enter' ? props.setIsRenaming(false) : null}
                value={props.field.label.name}
                />
            ) : props.field.labelIsHidden === false ? (
                <Styled.FieldTitleLabel
                fieldIsHidden={props.field.fieldIsHidden}
                >
                    {props.field.label.name}
                    {props.field.required === true ? '*' : ''}
                </Styled.FieldTitleLabel>
            ) : props.field.labelIsHidden === true && props.field.fieldIsHidden === true ? (
                <Styled.FieldIsHiddenAndLabelIsHiddenMessage>
                    {strings('formularyFieldEditLabelAndFieldIsHiddenMessage').replace('{}', props.field.label.name)}
                </Styled.FieldIsHiddenAndLabelIsHiddenMessage>
            ) : null : null}
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
                                {fieldType.canBeRequired === true ? (
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
                                            {strings('formularyFieldEditIsRequiredLabel')}
                                        </Styled.FieldEditMenuDropdownSwitchLabel>
                                    </Styled.FieldEditMenuDropdownSwitchContainer>
                                ) : null}
                                {fieldType.canLabelBeHidden === true ? (
                                    <Styled.FieldEditMenuDropdownSwitchContainer
                                    onClick={() => props.onChangeLabelIsHidden(!props.field.labelIsHidden)}
                                    >
                                        <Switch
                                        isSelected={props.field.labelIsHidden}
                                        onSelect={() => props.onChangeLabelIsHidden(!props.field.labelIsHidden)}
                                        /> 
                                        <Styled.FieldEditMenuDropdownSwitchLabel>
                                            {strings('formularyFieldEditLabelIsHiddenLabel')}
                                        </Styled.FieldEditMenuDropdownSwitchLabel>
                                    </Styled.FieldEditMenuDropdownSwitchContainer>
                                ) : null}
                                {fieldType.canFieldBeHidden === true ? (
                                    <Styled.FieldEditMenuDropdownSwitchContainer
                                    onClick={() => props.onChangeFieldIsHidden(!props.field.fieldIsHidden)}
                                    >
                                        <Switch
                                        isSelected={props.field.fieldIsHidden}
                                        onSelect={() => props.onChangeFieldIsHidden(!props.field.fieldIsHidden)}
                                        /> 
                                        <Styled.FieldEditMenuDropdownSwitchLabel>
                                            {strings('formularyFieldEditFieldIsHiddenLabel')}
                                        </Styled.FieldEditMenuDropdownSwitchLabel>
                                    </Styled.FieldEditMenuDropdownSwitchContainer>
                                ) : null}
                                {fieldType.canBeUnique === true ? (
                                    <Styled.FieldEditMenuDropdownSwitchContainer
                                    onClick={() => props.onChangeFieldIsUnique(!props.field.isUnique)}
                                    >
                                        <Switch
                                        isSelected={props.field.isUnique}
                                        onSelect={() => props.onChangeFieldIsUnique(!props.field.isUnique)}
                                        /> 
                                        <Styled.FieldEditMenuDropdownSwitchLabel>
                                            {strings('formularyFieldEditFieldIsUniqueLabel')}
                                        </Styled.FieldEditMenuDropdownSwitchLabel>
                                    </Styled.FieldEditMenuDropdownSwitchContainer>
                                ) : null}
                                {fieldType.hasPlaceholder === true ? (
                                    <Fragment>
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
                                    <Styled.FieldEditMenuDropdownButton
                                    onClick={() => {
                                        props.onToggleEditFieldMenu(false)
                                        props.setIsRenaming(!props.isRenaming)
                                    }}
                                    >
                                        {strings('formularyFieldEditRenameLabel')}
                                    </Styled.FieldEditMenuDropdownButton>
                                ) : null}
                                <Styled.FieldEditMenuDropdownButton>
                                    {strings('formularyFieldEditEditLabel')}
                                </Styled.FieldEditMenuDropdownButton>
                                <Styled.FieldEditMenuDropdownButton
                                onClick={() => props.onDuplicateField(props.field.uuid)}
                                >
                                    {strings('formularyFieldEditDuplicateLabel')}
                                </Styled.FieldEditMenuDropdownButton>
                                <Styled.FieldEditMenuDropdownButton
                                onClick={() => props.onRemoveField(props.field.uuid)}
                                isExclude={true}
                                >
                                    {strings('formularyFieldEditDeleteLabel')}
                                </Styled.FieldEditMenuDropdownButton>
                            </Styled.FieldEditMenuDropdownContainer>
                        </Styled.FieldEditMenuWrapper>
                    ) : ''}
                </Fragment>
            ) : ''}
            <Styled.FieldContainer
            fieldIsHidden={props.field.fieldIsHidden}
            >
                {fieldTypeName === 'text' ? (
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
                ) : fieldTypeName === 'checkbox' ? (
                    <FormularyFieldCheckbox
                    {...props}
                    />
                ) : fieldTypeName === 'multi_field' ? (
                    <FormularyFieldMultiField
                    {...props}
                    />
                ): fieldTypeName === 'heading1' ? (
                    <FormularyFieldHeading
                    {...props}
                    />
                ) : null}
            </Styled.FieldContainer>
        </Styled.Container>
    )
}