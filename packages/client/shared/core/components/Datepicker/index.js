import { useRef, useEffect, useState } from 'react'
import { strings } from '../../utils/constants'
import Layouts from './layouts'

/**
 * This is a minimal component that also serves as a template for the daterangepicker. So we can use the same component
 * for both, picking a single date or a range of dates.
 * 
 * Yes, this has functions similar to the ones in the 'shared/flow/helpers/datetime.js' file. We don't use flow helpers here
 * because it'll be a HELL lot easier to maintain if we keep flow isolated from the rest and this also isolated.
 * 
 */
export default function Datepicker(props) {
    const today = new Date()
    const onOpenDatepicker = typeof props.onOpenDatepicker === 'function' ? props.onOpenDatepicker : null
    const canSelectDateBelowToday = typeof props.canSelectDateBelowToday === 'boolean' ? props.canSelectDateBelowToday : true
    const daysOfTheWeek = Array.isArray(props.daysOfTheWeek) && props.daysOfTheWeek.length === 7 ? props.daysOfTheWeek : [
        strings('pt-BR', 'datePickerDayOfTheWeekSundayLabel'),
        strings('pt-BR', 'datePickerDayOfTheWeekMondayLabel'),
        strings('pt-BR', 'datePickerDayOfTheWeekTuesdayLabel'),
        strings('pt-BR', 'datePickerDayOfTheWeekWednesdayLabel'),
        strings('pt-BR', 'datePickerDayOfTheWeekThursdayLabel'),
        strings('pt-BR', 'datePickerDayOfTheWeekFridayLabel'),
        strings('pt-BR', 'datePickerDayOfTheWeekSaturdayLabel')
    ]
    const monthsOfTheYear = Array.isArray(props.monthsOfTheYear) && props.monthsOfTheYear.length === 12 ? props.monthsOfTheYear : [
        strings('pt-BR', 'datePickerMonthOfTheYearJanuaryLabel'),
        strings('pt-BR', 'datePickerMonthOfTheYearFebruaryLabel'),
        strings('pt-BR', 'datePickerMonthOfTheYearMarchLabel'),
        strings('pt-BR', 'datePickerMonthOfTheYearAprilLabel'),
        strings('pt-BR', 'datePickerMonthOfTheYearMayLabel'),
        strings('pt-BR', 'datePickerMonthOfTheYearJuneLabel'),
        strings('pt-BR', 'datePickerMonthOfTheYearJulyLabel'),
        strings('pt-BR', 'datePickerMonthOfTheYearAugustLabel'),
        strings('pt-BR', 'datePickerMonthOfTheYearSeptemberLabel'),
        strings('pt-BR', 'datePickerMonthOfTheYearOctoberLabel'),
        strings('pt-BR', 'datePickerMonthOfTheYearNovemberLabel'),
        strings('pt-BR', 'datePickerMonthOfTheYearDecemberLabel')
    ]
    const daysGridNumberOfRows = 6
    const daysGridNumberOfColumns = daysOfTheWeek.length
    const daysGridNumberOfDays = daysGridNumberOfRows * daysGridNumberOfColumns
    const dateSelected = (props.dateSelected instanceof Date) ? props.dateSelected : today
    const dateFormat = ![null, undefined].includes(props.dateFormat) ? props.dateFormat : 'YYYY-MM-DD'
    const datePartsFormats = {
        YYYY: {
            represents: 'year',
            validateCharacterAtPosition: (character, position) => {
                const isCharacterANumber = /^\d$/.test(character)
                if (isCharacterANumber && [0, 1, 2, 3].includes(position)) return character
                else return ''
            }
        },
        MM: {
            represents: 'month',
            validateCharacterAtPosition: (character, position) => {
                const isCharacterANumber = /^\d$/.test(character)
                if (isCharacterANumber && [0, 1].includes(position)) return character
                else return ''
            }
        },
        DD: {
            represents: 'day',
            validateCharacterAtPosition: (character, position) => {
                const isCharacterANumber = /^\d$/.test(character)
                if (isCharacterANumber && [0, 1].includes(position)) return character
                else return ''
            }
        },
        hh: {
            represents: 'hour',
            validateCharacterAtPosition: (character, position) => {
                const isCharacterANumber = /^\d$/.test(character)
                if (isCharacterANumber && [0, 1].includes(position)) return character
                else return ''
            }
        },
        HH: {
            represents: 'hour',
            validateCharacterAtPosition: (character, position) => {
                const isCharacterANumber = /^\d$/.test(character)
                if (isCharacterANumber && [0, 1].includes(position)) return character
                else return ''
            }
        },
        mm: {
            represents: 'minute',
            validateCharacterAtPosition: (character, position) => {
                const isCharacterANumber = /^\d$/.test(character)
                if (isCharacterANumber && [0, 1].includes(position)) return character
                else return ''
            }
        },
        ss: {
            represents: 'second',
            validateCharacterAtPosition: (character, position) => {
                const isCharacterANumber = /^\d$/.test(character)
                if (isCharacterANumber && [0, 1].includes(position)) return character
                else return ''
            }
        }
    }

    const dateInputRef = useRef()
    const datePickerRef = useRef()
    const nonFormatRegex = useRef(null)
    const startAndEndPositionsOfFormatsInStringRef = useRef(null)
    const [days, setDays] = useState(getMonthDays(dateSelected.getFullYear(), dateSelected.getMonth()))
    const [isInputFocused, setIsInputFocused] = useState(false)
    const [selectedDate, setSelectedDate] = useState(dateSelected)
    const [currentYear, setCurrentYear] = useState(dateSelected.getFullYear())
    const [currentMonth, setCurrentMonth] = useState(dateSelected.getMonth())
    const [positionAndMaxHeight, setPositionAndMaxHeight] = useState({
        position: { x: 0, y: 0 }, 
        maxHeight: null, 
        wasCalculated:false
    })
    const [dateValue, setDateValue] = useState('')
    
    /**
     * Get the regex for the parts of the string that are not formats. So on the example date format: 
     * YYYY-MM::DD
     * We will have the regex like the following: (-)?(:)?. This way we can do dateFormat.replace(/(-)?(:)?/g, '')
     * 
     * @param {boolean} [forceRefresh=false] - If true, the cache will be refreshed so we need to regenerate it.
     */
    function getNonDatePartFormatRegex(forceRefresh=false) {
        if (nonFormatRegex.current !== null && !forceRefresh) {
            return nonFormatRegex.current
        } else {
            const dateFormatPartsRegex = Object.keys(datePartsFormats).map(format => `(${format})?`).join('')
            nonFormatRegex.current = [...new Set(dateFormat.replaceAll(new RegExp(dateFormatPartsRegex, 'g'), '').split(''))].map(format => `(${format})?`).join('')
        }
    }

    /**
     * Function used for saving the format positions in the cache of this component. Format positions are, for example:
     * {
     *      0: {position: 0, format: 'YYYY'}, 
     *      1: {position: 1, format: 'YYYY'}, 
     *      2: {position: 2, format: 'YYYY'},
     *      3: {position: 3, format: 'YYYY'},
     *      5: {position: 0, format: 'MM'},
     *      6: {position: 1, format: 'MM'},
     * } 
     * 
     * What this means is that from index 0 to index 3 we have the format 'YYYY' and from index 5 to index 6 we have the format 'MM'. And on position 5
     * we have the first character of the month value (with this we can prevent certain numbers at specific positions, for exmaple, on the month, the position 0)
     * can only be 1 or 0, and the position 1 can only be 0 to 9.
     * 
     * @param {boolean} [forceRefresh=false] - If true, the cache will be refreshed.
     */
    function getFormatPositions(forceRefresh=false) {
        if (startAndEndPositionsOfFormatsInStringRef.current !== null && !forceRefresh) {
            return startAndEndPositionsOfFormatsInStringRef.current
        } else {
            startAndEndPositionsOfFormatsInStringRef.current = {}
            for (const validDateFormat of Object.keys(datePartsFormats)) {
                const formatRegex = new RegExp(validDateFormat, 'g')
                const doesFormatPartExistsInDateFormat = formatRegex.test(dateFormat)
                if (doesFormatPartExistsInDateFormat) {
                    const startingPositionOfFormat = dateFormat.indexOf(validDateFormat)
                    const endindPositionOfFormat = startingPositionOfFormat + validDateFormat.length - 1
                    for (let i = startingPositionOfFormat; i <= endindPositionOfFormat; i++) {
                        startAndEndPositionsOfFormatsInStringRef.current[i] = {
                            position: i - startingPositionOfFormat,
                            format: validDateFormat
                        }
                    }
                }
            }
        }
    }

    function getMonthDays(year, month) {
        const monthDayOfTheWeekStart = (new Date(year, month)).getDay()
        let monthArray = []

        for (let index=0; index < daysGridNumberOfDays; index++) {
            const dayOfTheWeek = index - monthDayOfTheWeekStart
            const date = new Date(year, month, dayOfTheWeek+1)
            monthArray.push(date)
        }
        return monthArray
    }

    /**
     * / * WEB ONLY * /
     * 
     * If we are rendering the date picker on the web, what we need to do is that we need to calculate the position and the max height of it.
     * Because what we do is that we render the datepicker on a fixed position AND NOT on an absolute position. This means that the datepicker is
     * rendered "above" of the content, and the content will stay behind of the datepicker. This means all of the elements outside of the datepicker 
     * are not clickable except the date picker itself.
     * 
     * So since we render on a fixed position we need to calculate if we will render this datepicker above or below the input, and the max height of it 
     * (there is no scroll).
     */
    function webRenderOnTopOrBottomAndGetPosition() {
        if (process.env['APP'] === 'web') {
            const dateInputRect = dateInputRef.current.getBoundingClientRect()
            const datePickerRect = datePickerRef.current.getBoundingClientRect()
            const bottomOfInput = dateInputRect.bottom
            const doesDatePickerPassBottom = bottomOfInput + datePickerRect.height > window.innerHeight
            if (doesDatePickerPassBottom === true) {
                let yPosition = dateInputRect.top - datePickerRect.height
                if (yPosition < 0) yPosition = 0
                setPositionAndMaxHeight({
                    wasCalculated: true,
                    position: { x: dateInputRect.left, y: yPosition }, 
                    maxHeight: dateInputRect.top
                })
            } else {
                let yPosition = dateInputRect.bottom
                setPositionAndMaxHeight({
                    wasCalculated: true,
                    position: { x: dateInputRect.left, y: yPosition }, 
                    maxHeight: window.innerHeight - yPosition
                })
            }
        }
    }

    /**
     * Function used for beautifuly format the date in the input. Yep, although this component is a Datepicker component, ofter times the user will want
     * to write the date instead of picking it from the calendar. It's a feedback we recieved from our users/clients, so this is definetly needed for the
     * datepicker.
     * 
     * So what this does is, as the user types the date we will format it inside of the input from the format given to this component, if no format is given 
     * we will use the default format 'YYYY-MM-DD'. This works similar to a mask, the user can only change the numbers/characters that are valid in the input
     * not the ones outside of it. For example. YYYY-MM::DD, YYYY, MM and DD are defined in `datePartsFormats` so the characters '-' and ':' the user cannot 
     * change in the string.
     * 
     * So how does this work:
     * 1 - We run the `getNonDatePartFormatRegex` to get the regex for the parts of the string that are not formats. So on the example above we will have the regex
     * like the following: (-)?(:)?. This way we can do dateFormat.replace(/(-)?(:)?/g, '')
     * 2 - We get the format positions, for example: {
     *      0: {position: 0, format: 'YYYY'}, 
     *      1: {position: 1, format: 'YYYY'}, 
     *      2: {position: 2, format: 'YYYY'},
     *      3: {position: 3, format: 'YYYY'},
     *      5: {position: 0, format: 'MM'},
     *      6: {position: 1, format: 'MM'},
     * } 
     * 
     * What this means is that from index 0 to index 3 we have the format 'YYYY' and from index 5 to index 6 we have the format 'MM'. And on position 5
     * we have the first character of the month value (with this we can prevent certain numbers at specific positions, for exmaple, on the month, the position 0)
     * can only be 1 or 0, and the position 1 can only be 0 to 9.
     * 3 - We replace the date value removing all of the parts that are non date values. (For example, the '-' and ':' characters) and then split the string.
     * 4 - Retrieve the formated value from the value splitted.
     * 
     * @param {string} newValue - The date value of the input that we want to change and format.
     */
    function onChangeText(newValue) {
        /**
         * Retrieves the value formated. We do that by looping the splitted value and adding the numbers in the desired format.
         * BEAWARE: We change the loop inside of the loop by defining the offset index, this means that if we recieve only numbers,
         * and we add '-' between the date, we will add it to the offsetIndex. For example: YYYY-MM-DD, the offsetIndex will be 2.
         * 
         * @param {Array<string>} valueSplitted - The value of the string with each character splitted inside an array.
         * 
         * @returns {string} - The value formated.
         */
        function getFormatedValue(valueSplitted) {
            let formatedValue = ''
            let offsetIndex = 0
                       
            for (let i=0; i < valueSplitted.length + offsetIndex; i++) {
                const characterAtPositionInValue = valueSplitted[i-offsetIndex]
                const formatInPosition = startAndEndPositionsOfFormatsInStringRef.current[i]
                if (formatInPosition !== undefined) {
                    const datePartFormat = datePartsFormats[formatInPosition.format]
                    formatedValue += datePartFormat.validateCharacterAtPosition(characterAtPositionInValue, formatInPosition.position)
                } else if (dateFormat[i] !== undefined) {
                    const nonFormatCharacter = dateFormat[i]
                    formatedValue += nonFormatCharacter
                    if (nonFormatCharacter !== characterAtPositionInValue) offsetIndex++
                }
            }
            return formatedValue
        }
        
        getNonDatePartFormatRegex()
        getFormatPositions()

        const valueSplitted = newValue.replace(new RegExp(nonFormatRegex.current, 'g'), '').split('')
        let formatedValue = getFormatedValue(valueSplitted)        

        setDateValue(formatedValue)
    }
    
    function onAddOrReduceCurrentMonth(amount) {
        let newMonth = currentMonth + amount
        let newYear = currentYear
        if (newMonth > 11) {
            newMonth = 0
            newYear++
        } else if (newMonth < 0) {
            newMonth = 11
            newYear--
        }        
        setCurrentMonth(newMonth)
        setCurrentYear(newYear)
        setDays(getMonthDays(newYear, newMonth))
    }

    /**
     * Toggles if the datepicker is open or closed. If true then the datepicker will open, otherwise it will close.
     * When we open the datepicker and we are on the web we will get the position it will be rendered (top or bottom).
     * Otherwise, if we are on the web and we close the datepicker we will set the position and maxHeight to not calculated.
     * 
     * @param {boolean} isOpen - If true then the datepicker will open, otherwise it will close.
     */
    function onToggleInputFocus(isOpen=!isInputFocused) {
        setIsInputFocused(isOpen)
        
        if (onOpenDatepicker !== null) {
            onOpenDatepicker(isOpen)
        }

        if (isOpen === true && process.env['APP'] === 'web') {
            setTimeout(() => {
                webRenderOnTopOrBottomAndGetPosition()                
            }, 1)
        } else if (isOpen === false && process.env['APP'] === 'web') {
            setPositionAndMaxHeight({ ...positionAndMaxHeight, wasCalculated: false })
        }
    }

    useEffect(() => {
        getFormatPositions(true)
        getNonDatePartFormatRegex(true)
    }, [props.dateFormat])

    return process.env['APP'] === 'web' ? (
        <Layouts.Web
        datePickerRef={datePickerRef}
        dateInputRef={dateInputRef}
        customInputComponent={props.customInputComponent}
        isInputFocused={isInputFocused}
        onToggleInputFocus={onToggleInputFocus}
        onChangeText={onChangeText}
        onAddOrReduceCurrentMonth={onAddOrReduceCurrentMonth}
        monthsOfTheYear={monthsOfTheYear}
        currentMonth={currentMonth}
        currentYear={currentYear}
        daysOfTheWeek={daysOfTheWeek}
        dateValue={dateValue}
        positionAndMaxHeight={positionAndMaxHeight}
        daysGridNumberOfRows={daysGridNumberOfRows}
        daysGridNumberOfColumns={daysGridNumberOfColumns}
        days={days}
        today={today}
        canSelectDateBelowToday={canSelectDateBelowToday}
        selectedDate={selectedDate}
        />
    ) : (
        <Layouts.Mobile/>
    )
}