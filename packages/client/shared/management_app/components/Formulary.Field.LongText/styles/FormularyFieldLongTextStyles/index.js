import { APP } from '../../../../../conf'
import * as Mobile from './mobileStyles'
import * as Web from './webStyles'

export default APP === 'web' ? { ...Web } : { ...Mobile }