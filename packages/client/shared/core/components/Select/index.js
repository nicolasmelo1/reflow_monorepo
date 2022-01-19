import { useRef, useState, useEffect } from 'react'
import { useClickedOrPressedOutside } from '../../hooks'
import Layouts from "./layouts"

export default function Select(props) {
    const isPropsOpenDefined = typeof props.open === 'boolean'
    const isPropsOptionDefined = Array.isArray(props.options)
    const isPropsSearchDefinedAndAString = ![null, undefined].includes(props.search) && typeof props.search === 'string'
    
    const selectRef = useRef()
    const searchInputRef = useRef()
    const preventCloseRef = useRef(false)
    const [searchInputWidth, setSearchInputWidth] = useState(1)
    const [isOpen, setIsOpen] = useState(isPropsOpenDefined ? props.open : true)
    const [search, setSearch] = useState(isPropsSearchDefinedAndAString ? props.search : '')
    const [options, setOptions] = useState(isPropsOptionDefined ? props.options : [])
    useClickedOrPressedOutside({ ref: selectRef, callback: closeWhenUserPressesOutside })

    /**
     * / * WEB ONLY * /
     * 
     * We close the options container when the user clicks outside of the select container.
     * So when he clicks anywhere outside of the select container we will toggle the options container to close.
     * 
     * This is available only on web because on mobile we do not open a dropdown, instead we open a modal that consumes
     * the hole height and width of the screen.
     */
    function closeWhenUserPressesOutside() {
        if (process.env['APP'] === 'web') onToggleOpen(false)
    }

    /**
     * This will be called on the onInput event to change the size of the input as he types.
     * We use the idea of using `ch` units to define the width of the input.
     * 
     * Reference: https://stackoverflow.com/a/43488899
     * 
     * @param {string} value - The value the user is typing on the input.
     */
    function adjustWidthOfSearchInput(value) {
        if (searchInputRef.current) {
            const valueLength = value.length
            setSearchInputWidth(valueLength < 1 ? 1 : valueLength)
        }
    }

    /**
     * This will be called when we want to open or close the options container.
     */
    function onToggleOpen(isSelectOpen=!isOpen) {
        const nextState = isSelectOpen
        setIsOpen(nextState)

        if (nextState === false) {
            onSearch('')
            if (process.env['APP'] === 'web' && searchInputRef.current) {
                searchInputRef.current.blur()
            }
        }

        const isPropsOnOpenDefined = typeof props.onOpen === 'function'
        if (isPropsOnOpenDefined) {
            props.onOpen(nextState)
        }
    }

    /**
     * This will change the value of the search input as he types, it will also filter by the options label.
     * 
     * The filtering only happens if no `onSearch` prop is defined. When the value is an empty string, then
     * it will show all of the options again.
     * 
     * @param {string} value - The value the user is typing on the input.
     */
    function onSearch(value) {
        setSearch(value)
        const isPropsOnSearchCallbackDefinedAndAFunction = ![null, undefined].includes(props.onSearch) && 
            typeof props.onSearch === 'function'
        if (isPropsOnSearchCallbackDefinedAndAFunction) {
            props.onSearch(value)
        } else {
            if (value !== '') {
                const filteredOptions = options.filter(option => option.label.toLowerCase().includes(value.toLowerCase()))
                setOptions(filteredOptions)
            } else {
                setOptions(props.options)
            }
        }
    }

    useEffect(() => {
        if (isPropsSearchDefinedAndAString && search !== props.search) {
            setSearch(props.search)
        } 
    }, [props.search])

    useEffect(() => {
        if (isPropsOptionDefined && JSON.stringify(options) !== JSON.stringify(props.options)) {
            setOptions(props.options)
        }
    }, [props.options])
    
    return process.env['APP'] === 'web' ? (
        <Layouts.Web
        preventCloseRef={preventCloseRef}
        selectRef={selectRef}
        searchInputRef={searchInputRef}
        options={options}
        search={search}
        isOpen={isOpen}
        searchInputWidth={searchInputWidth}
        adjustWidthOfSearchInput={adjustWidthOfSearchInput}
        onSearch={onSearch}
        onToggleOpen={onToggleOpen}
        />
    ) : (
        <Layouts.Mobile/>
    )
}