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
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { 
    faEllipsisH
} from '@fortawesome/free-solid-svg-icons'

export default function FormularyFieldWebLayout(props) {
    const fieldTypeName = props.retrieveFieldTypeName()
    return (
        <Styled.Container
        onMouseOver={() => props.onHoverFieldWeb(true)}
        onMouseLeave={() => props.onHoverFieldWeb(false)}
        >
            {props.field.labelIsHidden === false ? (
                <Styled.FieldTitleLabel
                fieldIsHidden={props.field.fieldIsHidden}
                >
                    {props.field.labelName}
                    {props.field.required === true ? '*' : ''}
                </Styled.FieldTitleLabel>
            ) : ''}
            <Styled.FieldEditMenu
            isHovering={props.isHovering}
            >
                <Styled.FieldEditButtonMenu
                isHovering={props.isHovering}
                onClick={() => props.onToggleEditFieldMenu()}
                >
                    <FontAwesomeIcon
                    icon={faEllipsisH}
                    />
                </Styled.FieldEditButtonMenu>
                {props.isEditMenuOpen === true ? (
                    <Styled.FieldEditMenuDropdownContainer>
                        <Styled.FieldEditMenuDropdownButton>
                            {'Renomear'}
                        </Styled.FieldEditMenuDropdownButton>
                        <Styled.FieldEditMenuDropdownButton>
                            {'Editar'}
                        </Styled.FieldEditMenuDropdownButton>
                    </Styled.FieldEditMenuDropdownContainer>
                ) : ''}
            </Styled.FieldEditMenu>
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
            ) : ''}
        </Styled.Container>
    )
}