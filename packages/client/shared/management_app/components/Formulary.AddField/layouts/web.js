import { Tooltip, strings } from '../../../../core'
import Styled from '../styles'

export default function FormularyAddFieldWebLayout(props) {
    return (
        <Styled.Container
        isHovered={props.isHovered}
        onMouseOver={() => props.onToggleHover(true)}
        onMouseLeave={() => props.onToggleHover(false)}
        >   
            {props.isHovered === true ? (
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
                                <Styled.FieldTypeButtonIcon
                                icon={props.getIconByFieldTypeId(fieldType.id)}
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