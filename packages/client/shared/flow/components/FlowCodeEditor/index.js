import Layouts from './layouts'

/**
 * This is different from the other components, most of the logic is on the layout itself and not here.
 * That's because there are lot of particularities between react native and react that we need to address.
 */
export default function FlowCodeEditor(props) {
    return (
        <Layouts {...props}/>
    )
}