import { APP } from '../../../../conf'
import Mobile, { DropdownMenuDateFormatOptionMobileLayout } from './mobile'
import Web, { DropdownMenuDateFormatOptionWebLayout } from './web'

export default {
    Field: APP === 'web' ? Web : Mobile,
    DropdownMenu: APP === 'web' ? DropdownMenuDateFormatOptionWebLayout : DropdownMenuDateFormatOptionMobileLayout
}