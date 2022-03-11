import { APP } from '../../../../conf'
import Mobile, { DropdownMenuFormulaFormatOptionMobileLayout } from './mobile'
import Web, { DropdownMenuFormulaFormatOptionWebLayout } from './web'

export default {
    Field: APP === 'web' ? Web : Mobile,
    DropdownMenu: APP === 'web' ? DropdownMenuFormulaFormatOptionWebLayout : DropdownMenuFormulaFormatOptionMobileLayout
}