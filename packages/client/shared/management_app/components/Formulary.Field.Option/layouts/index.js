import { APP } from '../../../../conf'
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

export default APP === 'web' ? {
    Field: WebField,
    CustomOptionSelect: CustomOptionSelectWebLayout,
    CustomCreateOptionButton: CustomCreateOptionButtonWebLayout,
    CustomSelectedOption: CustomSelectedOptionWebLayout
} : {
    Field: MobileField,
    CustomOptionSelect: CustomOptionSelectMobileLayout,
    CustomCreateOptionButton: CustomCreateOptionButtonMobileLayout,
    CustomSelectedOption: CustomSelectedOptionMobileLayout
}
