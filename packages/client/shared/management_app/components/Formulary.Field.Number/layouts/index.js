import { APP } from '../../../../conf'
import Mobile, { DropdownMenuNumberFormatOptionMobileLayout } from './mobile'
import Web, { DropdownMenuNumberFormatOptionWebLayout } from './web'


export default APP === 'web' ? {
    Field: Web,
    DropdownMenu: DropdownMenuNumberFormatOptionWebLayout
} : {
    Field: Mobile,
    DropdownMenu: DropdownMenuNumberFormatOptionMobileLayout
}
