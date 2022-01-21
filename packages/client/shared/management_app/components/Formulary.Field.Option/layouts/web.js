import { Select, strings } from '../../../../core'
import { faArrowUp, faArrowDown, faEllipsisH } from '@fortawesome/free-solid-svg-icons'
import Styled from '../styles'

export function CustomCreateOptionButtonWebLayout(props) {
    return (
        <Styled.SelectContainer>
            <Styled.SelectButton
            onClick={() => props.onCreateOption()}
            >
                {strings('pt-BR', 'formularyFieldOptionCreateOptionLabel')}
                <Styled.CreateOptionLabel>
                    {props.value}
                </Styled.CreateOptionLabel>
            </Styled.SelectButton>
        </Styled.SelectContainer>
    )
}

export function CustomOptionSelectWebLayout(props) {
    return (
        <Styled.SelectContainer
        onMouseOver={() => props.onHoverOption(true)}
        onMouseLeave={() => props.onHoverOption(false)}
        >
            <Styled.SelectButton
            onClick={() => props.onSelectOrRemoveOption(props.option)}
            >
                {props.option.label}
            </Styled.SelectButton>
            <Styled.SelectHelperButtonsContainer
            isHovering={props.isHovering}
            >
                <Styled.SelectHelperButtons
                onClick={() => props.onMoveOptionUp(props.option.index)}
                >
                    <Styled.SelectHelperButtonIcon
                    icon={faArrowUp}
                    />
                </Styled.SelectHelperButtons>
                <Styled.SelectHelperButtons
                onClick={() => props.onMoveOptionDown(props.option.index)}
                >
                    <Styled.SelectHelperButtonIcon
                    icon={faArrowDown}
                    />
                </Styled.SelectHelperButtons>
                <Styled.SelectHelperButtons
                ref={props.editOptionButtonRef}
                onClick={() => props.onToggleEditing()}
                >
                    <Styled.SelectHelperButtonIcon
                    icon={faEllipsisH}
                    />
                </Styled.SelectHelperButtons>
                {props.isEditing ? (
                    <Styled.EditOptionMenuOverlay>
                        <Styled.EditOptionMenuContainer
                        ref={props.editMenuContainerRef}
                        editMenuPosition={props.editMenuPosition}
                        >
                            <button>
                                {'Renomear'}
                            </button>
                            <button>
                                {'Excluir'}
                            </button>
                        </Styled.EditOptionMenuContainer>
                    </Styled.EditOptionMenuOverlay>
                ) : ''}
            </Styled.SelectHelperButtonsContainer>
        </Styled.SelectContainer>
    )
}

export default function FormularyFieldOptionWebLayout(props) {
    return (
        <Styled.Container
        isOpen={props.isOpen}
        >
            <Select
            creatable={true}
            customProps={props.customOptionComponentProps}
            customHelperLabel={strings('pt-BR', 'formularyFieldOptionCustomHelperLabel')}
            customCreateOptionComponent={props.customCreateOptionComponent}
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