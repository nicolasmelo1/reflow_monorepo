import Styled from '../styles'
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
 
export default function DatepickerWebLayout(props) {
    const CustomInputComponent = props.customInputComponent

    return (
        <div>
            {![null, undefined].includes(CustomInputComponent) ? (
                <CustomInputComponent
                ref={props.dateInputRef}
                value={props.dateValue}
                onBlur={(e) => props.onToggleInputFocus(true)}
                onChange={(e) => props.onChangeText(e.target.value)}
                onClick={(e) => props.onToggleInputFocus(true)}
                type={'text'}
                />
            ) : (
                <Styled.Input 
                ref={props.dateInputRef}
                value={props.dateValue}
                onBlur={(e) => props.onToggleInputFocus(true)}
                onChange={(e) => props.onChangeText(e.target.value)}
                onClick={(e) => props.onToggleInputFocus(true)}
                type={'text'}
                />
            )}
            {props.isInputFocused === true ? (
                <Styled.DatepickerWrapper
                positionAndMaxHeight={props.positionAndMaxHeight}
                >
                    <Styled.DatepickerContainer
                    ref={props.datePickerRef}
                    positionAndMaxHeight={props.positionAndMaxHeight}
                    >
                        <Styled.DatepickerHeader>
                            <Styled.DatepickerMonthTitle>
                                {props.monthsOfTheYear[props.currentMonth]}
                            </Styled.DatepickerMonthTitle>
                            <Styled.DatepickerChangeMonthButtonsContainer>
                                <Styled.DatepickerChangeMonthButton
                                onClick={() => props.onAddOrReduceCurrentMonth(-1)}
                                >
                                    <FontAwesomeIcon
                                    icon={faChevronLeft}
                                    />
                                </Styled.DatepickerChangeMonthButton>
                                <Styled.DatepickerChangeMonthButton
                                onClick={() => props.onAddOrReduceCurrentMonth(1)}
                                >
                                    <FontAwesomeIcon
                                    icon={faChevronRight}
                                    />
                                </Styled.DatepickerChangeMonthButton>
                            </Styled.DatepickerChangeMonthButtonsContainer>
                        </Styled.DatepickerHeader>
                        <Styled.DayOfTheWeekAndDaysOfTheMonthContainer>
                            <Styled.TableRowContainer>
                                {props.daysOfTheWeek.map(daysOfTheWeek => (
                                    <Styled.DayOfTheWeekAndDaysOfTheMonthCell
                                    key={daysOfTheWeek}
                                    >
                                        <Styled.DayOfTheWeekLabel>
                                            {daysOfTheWeek.slice(0, 3)}
                                        </Styled.DayOfTheWeekLabel>
                                    </Styled.DayOfTheWeekAndDaysOfTheMonthCell>
                                ))}
                            </Styled.TableRowContainer>
                            {Array(props.daysGridNumberOfRows).fill(null).map((_, rowIndex) => (
                                <Styled.TableRowContainer
                                key={rowIndex}
                                >   
                                    {Array(props.daysGridNumberOfColumns).fill(null).map((_, columnIndex) => {
                                        const dayIndex = (rowIndex * props.daysGridNumberOfColumns) + columnIndex
                                        const date = props.days[dayIndex] !== undefined ? props.days[dayIndex] : ''
                                        const isFromTheCurrentMonth = date instanceof Date ? date.getMonth() === props.currentMonth : false
                                        const isBelowToday = date instanceof Date && props.canSelectDateBelowToday === false ? date.getDate() < props.today.getDate() : false
                                        return (
                                            <Styled.DayOfTheWeekAndDaysOfTheMonthCell
                                            key={columnIndex}
                                            isLeftCell={columnIndex === 0}
                                            isTopCell={rowIndex === 0}
                                            isFirstDayOfTheMonth={date.getDate() === 1}
                                            isDaysOfTheMonthCell={true}
                                            isBelowToday={isBelowToday}
                                            isFromTheCurrentMonth={isFromTheCurrentMonth}
                                            >
                                                {isFromTheCurrentMonth ? (
                                                    <Styled.DayLabel
                                                    isFromTheCurrentMonth={date.getMonth() === props.currentMonth}
                                                    isBelowToday={isBelowToday}
                                                    >
                                                        {date.getDate()}
                                                    </Styled.DayLabel>
                                                ) : ''}
                                            </Styled.DayOfTheWeekAndDaysOfTheMonthCell>
                                        )
                                    })}
                                </Styled.TableRowContainer>
                            ))}
                        </Styled.DayOfTheWeekAndDaysOfTheMonthContainer>
                        
                    </Styled.DatepickerContainer>
                </Styled.DatepickerWrapper>
            ) : ''}
        </div>
    )
}