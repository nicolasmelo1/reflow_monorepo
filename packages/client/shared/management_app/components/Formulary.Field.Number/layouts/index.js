import Mobile, { DropdownMenuNumberFormatOptionMobileLayout } from './mobile'
import Web, { DropdownMenuNumberFormatOptionWebLayout } from './web'

export default {
    Mobile: {
        Field: Mobile,
        DropdownMenu: DropdownMenuNumberFormatOptionMobileLayout
    },
    Web: {
        Field: Web,
        DropdownMenu: DropdownMenuNumberFormatOptionWebLayout
    }
}
