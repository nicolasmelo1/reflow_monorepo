import Styled from '../styles'

export default function TooltipWebLayout(props) {
    return (
        <div
        ref={props.containerRef}
        >
            {props.isOpen ? (
                <div
                ref={props.tooltipRef}
                style={{
                    top: props.tooltipPosition.position.y,
                    left: props.tooltipPosition.position.x,
                    position: 'fixed',
                    height: 100,
                    width: 100,
                    backgroundColor: 'red',
                    opacity: props.tooltipPosition.wasCalculated ? 1 : 0
                }}
                />
            ) : ''}
            {props.children}
        </div>
    )
}