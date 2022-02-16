import { APP } from '../../../../conf'
import MobileField, { 
    CustomOptionSelectMobileLayout, 
    CustomCreateOptionButtonMobileLayout, 
    CustomSelectedOptionMobileLayout,
    DropdownMenuTagsFormatOptionMobileLayout
} from './mobile'
import WebField, { 
    CustomOptionSelectWebLayout, 
    CustomCreateOptionButtonWebLayout,
    CustomSelectedOptionWebLayout,
    DropdownMenuTagsFormatOptionWebLayout
} from './web'

export default {
    Field: APP === 'web' ? WebField : MobileField,
    CustomOptionSelect: APP === 'web' ?  CustomOptionSelectWebLayout : CustomOptionSelectMobileLayout,
    CustomCreateOptionButton:  APP === 'web' ? CustomCreateOptionButtonWebLayout : CustomCreateOptionButtonMobileLayout,
    CustomSelectedOption:  APP === 'web' ? CustomSelectedOptionWebLayout : CustomSelectedOptionMobileLayout,
    DropdownMenu: APP === 'web' ? DropdownMenuTagsFormatOptionWebLayout : DropdownMenuTagsFormatOptionMobileLayout
}
