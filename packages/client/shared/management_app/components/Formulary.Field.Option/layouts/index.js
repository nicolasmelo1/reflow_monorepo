import MobileField, { CustomOptionSelectMobileLayout, CustomCreateOptionButtonMobileLayout } from './mobile'
import WebField, { CustomOptionSelectWebLayout, CustomCreateOptionButtonWebLayout } from './web'

export default {
    Mobile: {
        Field: MobileField,
        CustomOptionSelect: CustomOptionSelectMobileLayout,
        CustomCreateOptionButton: CustomCreateOptionButtonMobileLayout,
    },
    Web: {
        Field: WebField,
        CustomOptionSelect: CustomOptionSelectWebLayout,
        CustomCreateOptionButton: CustomCreateOptionButtonWebLayout,
    }
}
