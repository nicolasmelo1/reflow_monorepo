import { View } from 'react-native'

/**
 * This is the main layout of the app. All of your pages should has this as the first component.
 */
function MobileLayoutLayout(props) {
    return (
        <View>
            {props.children}
        </View>
    )
}

export default MobileLayoutLayout