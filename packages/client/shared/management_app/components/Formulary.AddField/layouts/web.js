import { Tooltip, strings } from '../../../../core'
import FieldTypeIcon from '../../FieldTypeIcon'
import Styled from '../styles'

export default function FormularyAddFieldWebLayout(props) {
    return (
        <Styled.Container
        isHovered={props.isHovered}
        onMouseOver={() => props.onToggleHover(true)}
        onMouseLeave={() => props.onToggleHover(false)}
        >   
            {props.isHovered === true ? (
                <Styled.ButtonWrapper>
                    <Styled.ButtonContainer>
                        <Tooltip
                        text={strings('formularyAddFieldTooltipButtonLabel')}
                        >
                            <Styled.Button
                            ref={props.addButtonRef}
                            onClick={() => props.onToggleFieldTypeOptionSelectionMenu(true)}
                            >
                                {'+'}
                            </Styled.Button>
                        </Tooltip>
                    </Styled.ButtonContainer>
                </Styled.ButtonWrapper>
            ) : null}
            {props.isFieldTypeOptionsSelectorOpen === true ? (
                <Styled.FieldTypeSelectorMenuWrapper>
                    <Styled.FieldTypeSelectorMenuContainer
                    ref={props.fieldTypeOptionsMenuRef}
                    fieldTypeSelectorPosition={props.fieldTypeOptionsMenuPosition}
                    >
                        {props.fieldTypes.map(fieldType => (
                            <Styled.FieldTypeButton 
                            key={fieldType.id}
                            onClick={() => props.onAddNewField(fieldType.id)}
                            >
                                <FieldTypeIcon 
                                fieldTypeId={fieldType.id}
                                />
                                {props.getFieldTypeLabelNameByFieldTypeId(fieldType.id)}
                            </Styled.FieldTypeButton>
                        ))}
                    </Styled.FieldTypeSelectorMenuContainer>
                </Styled.FieldTypeSelectorMenuWrapper>
            ) : null}
        </Styled.Container>
    )
}