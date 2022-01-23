import MobileField, { 
    CustomOptionSelectMobileLayout, 
    CustomCreateOptionButtonMobileLayout, 
    CustomSelectedOptionMobileLayout
} from './mobile'
import WebField, { 
    CustomOptionSelectWebLayout, 
    CustomCreateOptionButtonWebLayout,
    CustomSelectedOptionWebLayout
} from './web'

export default {
    Mobile: {
        Field: MobileField,
        CustomOptionSelect: CustomOptionSelectMobileLayout,
        CustomCreateOptionButton: CustomCreateOptionButtonMobileLayout,
        CustomSelectedOption: CustomSelectedOptionMobileLayout
    },
    Web: {
        Field: WebField,
        CustomOptionSelect: CustomOptionSelectWebLayout,
        CustomCreateOptionButton: CustomCreateOptionButtonWebLayout,
        CustomSelectedOption: CustomSelectedOptionWebLayout
    }
}
