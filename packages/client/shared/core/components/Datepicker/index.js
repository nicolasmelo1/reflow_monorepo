import { useRef, useEffect, useState } from 'react'
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
    const dateFormat = ![null, undefined].includes(props.dateFormat) ? props.dateFormat : 'YYYY-MM-DD'
    const datePartsFormats = {
        YYYY: {
            represents: 'year',
            regex: '(\\d{4})'
        },
        MM: {
            represents: 'month',
            regex: '(0[1-9]|1[0-2]|[1-9])'
        },
        DD: {
            represents: 'day',
            regex: '(0[1-9]|1[0-9]|2[0-9]|3[0-1]|[1-9])'
        },
        hh: {
            represents: 'hour',
            regex: '(0[0-9]|1[0-9]|2[0-3]|[1-9])'
        },
        HH: {
            represents: 'hour',
            regex: '(0[0-9]|1[0-9]|2[0-3]|[1-9])'
        },
        mm: {
            represents: 'minute',
            regex: '(0[0-9]|[1-5][0-9])'
        },
        ss: {
            represents: 'second',
            regex: '(0[0-9]|[1-5][0-9])'
        }
    }

    const dateInputRef = useRef()
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [dateValue, setDateValue] = useState('')
    
    function onChangeText(newDateValue) {
        if (newDateValue.length < dateFormat.length) {
            //newDateValue.
        }
    }

    useEffect(() => {
        let newPlaceholder = dateFormat
        for (const validDateFormat of Object.keys(datePartsFormats)) {
            newPlaceholder = newPlaceholder.replace(validDateFormat, '_'.repeat(validDateFormat.length))
        }
        setDateValue(newPlaceholder)
    }, [])

    return process.env['APP'] === 'web' ? (
        <Layouts.Web
        dateInputRef={dateInputRef}
        onChangeText={onChangeText}
        dateValue={dateValue}
        />
    ) : (
        <Layouts.Mobile/>
    )
}