import { Fragment } from 'react'
import Styled from '../styles'
import FieldEditDropdownMenu from '../../Field.Edit.DropdownMenu'
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
import { strings } from '../../../../core'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { 
    faEllipsisH
} from '@fortawesome/free-solid-svg-icons'


export default function FormularyFieldWebLayout(props) {
    const fieldType = props.getTypesById()[props.field.fieldTypeId]
    const fieldTypeName = typeof fieldType?.name === 'string' ? fieldType.name : ''

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
                        <FieldEditDropdownMenu
                        buttonRef={props.fieldEditMenuButtonRef}
                        componentOptionForDropdownMenuRef={props.componentOptionForDropdownMenuRef}
                        customOptionForDropdownMenuProps={props.customOptionForDropdownMenuProps}
                        isOpen={props.isFieldEditDropdownMenuOpen}
                        onToggleDropdownMenu={props.onToggleEditFieldMenu}
                        field={props.field}
                        onUpdateFormulary={props.onUpdateFormulary}
                        onDuplicateField={props.onDuplicateField}
                        onRemoveField={props.onRemoveField}
                        isRenaming={props.isRenaming}
                        onToggleIsRenaming={props.setIsRenaming}
                        onChangeField={props.onChangeField}
                        />
                    </Styled.FieldEditMenu>
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