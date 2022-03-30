import { APP } from '../../../../conf'
import Mobile, { FieldEditDropdownMenuMobileLayout } from './mobile'
import Web, { FieldEditDropdownMenuWebLayout } from './web'

export default {
    Field: APP === 'web' ? Web : Mobile,
    DropdownMenu: APP === 'web' ? FieldEditDropdownMenuWebLayout : FieldEditDropdownMenuMobileLayout
}