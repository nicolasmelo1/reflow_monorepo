import Styled from '../styles'
import { strings } from '../../../../core'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

export function DropdownMenuNumberFormatOptionWebLayout(props) {
    const numberFormatTypeSelected = props.numberFormatTypes.find(type => type.id === props.selected)

    return (
        <div
        style={{
            display: 'flex',
            flexDirection: 'row'
        }}
        >
            {props.isOpen ? (
                <Styled.DropdownMenuOptionSelectContainer 
                ref={props.menuRef}
                menuPosition={props.menuPosition}
                >
                    {props.numberFormatTypes.map((numberFormatType, index) => (
                        <Styled.DropdownMenuOptionSelectButton
                        key={numberFormatType.id}
                        isSelected={numberFormatType.id === props.selected}
                        isLast={index === props.numberFormatTypes.length - 1}
                        onClick={() => props.onSelect(numberFormatType.id)}
                        >
                            {props.getNumberFormatTypeStringByName(numberFormatType.name)}
                        </Styled.DropdownMenuOptionSelectButton>
                    ))}
                </Styled.DropdownMenuOptionSelectContainer>
            ) : ''}
            <Styled.DropdownMenuOptionButton
            ref={props.menuButtonRef}
            onClick={() => props.onOpenMenu(!props.isOpen)}
            >   
                <Styled.DropdownMenuOptionSelectButtonText>
                    {![null, undefined].includes(numberFormatTypeSelected) ? 
                    props.getNumberFormatTypeStringByName(numberFormatTypeSelected.name) : 
                    strings('pt-BR', 'formularyFieldNumberDropdownMenuNumberFormatOptionLabel')}
                </Styled.DropdownMenuOptionSelectButtonText>
                <FontAwesomeIcon icon={faChevronRight}/>
            </Styled.DropdownMenuOptionButton>
        </div>
    )
}

export default function FormularyFieldNumberWebLayout(props) {
    return (
        <Styled.Container>
            <Styled.Input 
            autoComplete={'whathever'}
            placeholder={props.field.placeholder}
            type={'text'}
            />
        </Styled.Container>
    )
}