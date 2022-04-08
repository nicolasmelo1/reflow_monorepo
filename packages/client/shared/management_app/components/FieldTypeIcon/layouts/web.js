import Styled from '../styles'
import { strings } from '../../../../core'
import { 
    faFont, faCalendarAlt, faChevronCircleDown, faPlug, faPaperclip,
    faAlignLeft, faAt, faFingerprint, faAddressBook, faCode, faListUl,
    faCheck, faListAlt
} from '@fortawesome/free-solid-svg-icons'

export default function FieldTypeIconWebLayout(props) {
    return (
        props.fieldTypeName === 'text' ? (
            <Styled.FieldTypeIcon icon={faFont}/>
        ) : 
        props.fieldTypeName === 'number' ? (
            <Styled.FieldTypeText>
                1
            </Styled.FieldTypeText>
        ) : 
        props.fieldTypeName === 'date' ? (
            <Styled.FieldTypeIcon icon={faCalendarAlt}/>
        ) : 
        props.fieldTypeName === 'option' ? (
            <Styled.FieldTypeIcon icon={faChevronCircleDown}/>
        ) : 
        props.fieldTypeName === 'connection' ? (
            <Styled.FieldTypeIcon icon={faPlug}/>
        ) : 
        props.fieldTypeName === 'attachment' ? (
            <Styled.FieldTypeIcon icon={faPaperclip}/>
        ) : 
        props.fieldTypeName === 'long_text' ? (
            <Styled.FieldTypeIcon icon={faAlignLeft}/>
        ) : 
        props.fieldTypeName === 'email' ? (
            <Styled.FieldTypeIcon icon={faAt}/>
        ) : 
        props.fieldTypeName === 'id' ? (
            <Styled.FieldTypeIcon icon={faFingerprint}/>
        ) : 
        props.fieldTypeName === 'user' ? (
            <Styled.FieldTypeIcon icon={faAddressBook}/>
        ) : 
        props.fieldTypeName === 'formula' ? (
            <Styled.FieldTypeIcon icon={faCode}/>
        ) : 
        props.fieldTypeName === 'tags' ? (
            <Styled.FieldTypeIcon icon={faListUl}/>
        ) : 
        props.fieldTypeName === 'checkbox' ? (
            <Styled.FieldTypeIcon icon={faCheck}/>
        ) : 
        props.fieldTypeName === 'multi_field' ? (
            <Styled.FieldTypeIcon icon={faListAlt}/>
        ) : 
        props.fieldTypeName === 'heading1' ? (
            <Styled.FieltTypeHeadingText>
                <span>
                    {strings('fieldTypeHeadingIconLabel')}
                </span>
                <Styled.FieltTypeHeadingLabelType>
                    1
                </Styled.FieltTypeHeadingLabelType>
            </Styled.FieltTypeHeadingText>
        ) : 
        null
    )
}