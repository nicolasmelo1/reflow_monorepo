import { useEffect, useState, useRef } from 'react'
import { APP } from '../../../conf'
import Layout from './layouts'

export default function Tooltip(props) {
    const [isOpen, _setIsOpen] = useState(false)
    const [tooltipPosition, setTooltipPosition] = useState({
        position: { x: 0, y: 0 }, 
        maxHeight: null, 
        wasCalculated: false
    })
    const isOpenRef = useRef(isOpen)
    const containerRef = useRef()
    const tooltipRef = useRef()

    function setIsOpen(isTooltipOpen) {
        isOpenRef.current = isTooltipOpen
        _setIsOpen(isTooltipOpen)
    }

    function webCalculateTooltipPosition() {
        if (APP === 'web' && tooltipRef.current && containerRef.current) {
            const tooltipRect = tooltipRef.current.getBoundingClientRect()
            const containerRect = containerRef.current.getBoundingClientRect()
            const doesTooltipPassRight = containerRect.right + tooltipRect.width > window.innerWidth
            const horizontalMiddle = containerRect.width / 2 - tooltipRect.width / 2
            const verticalMiddle = containerRect.height / 2 - tooltipRect.height / 2
            // default load on bottom
            let maxHeight = window.innerHeight - containerRect.bottom
            let yPosition = containerRect.bottom
            let xPosition = containerRect.left + horizontalMiddle

            const doesTooltipPassLeft = containerRect.left + tooltipRect.width > window.innerWidth
            if (doesTooltipPassLeft === true) {
                yPosition = containerRect.top + verticalMiddle
                xPosition = containerRect.left - tooltipRect.width
            } else {
                yPosition = containerRect.top + verticalMiddle
                xPosition = containerRect.right
            }
            
            const doesTooltipPassBottom = yPosition + tooltipRect.height > window.innerHeight
            if (doesTooltipPassBottom === true) {
                // will load on top
                yPosition = containerRect.top - tooltipRect.height
                if (yPosition < 0) yPosition = 0

                maxHeight = containerRect.top - containerRect.height - 5
            }

            const doesTooltipPassTop = yPosition < 0
            
            setTooltipPosition({
                wasCalculated: true,
                position: { 
                    x: xPosition, 
                    y: yPosition 
                }, 
                maxHeight: maxHeight
            })
        }
    }

    function onOpenOrClose(isOpen) {
        setIsOpen(isOpen)
        if (isOpen === true) {
            setTimeout(() => {
                webCalculateTooltipPosition()
            }, 1)
        } else {
            setTooltipPosition({
                wasCalculated: false,
                position: { x: 0, y: 0 },
                maxHeight: null
            })
        }
    }

    function webOnMouseMove(e) {
        if (containerRef.current && containerRef.current.contains(e.target) && isOpenRef.current === false) {
            onOpenOrClose(true)
        } else if (containerRef.current && !containerRef.current.contains(e.target) && isOpenRef.current === true) {
            onOpenOrClose(false)
        }
    }


    useEffect(() => {
        if(APP) document.addEventListener('mousemove', webOnMouseMove)
        return () => {
            if(APP) document.removeEventListener('mousemove', webOnMouseMove) 
        }
    }, [])

    return (
        <Layout
        tooltipRef={tooltipRef}
        containerRef={containerRef}
        tooltipPosition={tooltipPosition}
        isOpen={isOpen}
        children={props.children}
        />
    )
}