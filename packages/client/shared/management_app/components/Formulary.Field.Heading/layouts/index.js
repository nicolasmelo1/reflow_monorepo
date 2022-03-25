import { APP } from '../../../../conf'
import Mobile, { FormularyFieldHeadingDropdownMenuMobileLayout } from './mobile'
import Web, { FormularyFieldHeadingDropdownMenuWebLayout } from './web'

export default {
    Field: APP === 'web' ? Web : Mobile,
    DropdownMenu: APP === 'web' ? FormularyFieldHeadingDropdownMenuWebLayout : FormularyFieldHeadingDropdownMenuMobileLayout
}