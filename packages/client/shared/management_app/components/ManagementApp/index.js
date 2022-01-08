import Layouts from './layout'

export default function ManagementApp(props) {
    return process.env['APP'] === 'web' ? (
        <Layouts.Web/>
    ) : (
        <Layouts.Mobile/>
    )
}