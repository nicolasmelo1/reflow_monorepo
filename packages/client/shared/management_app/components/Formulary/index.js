import Layouts from './layouts'

export default function Formulary(props) {
    return process.env['APP'] === 'web' ? (
        <Layouts.Web/>
    ) : (
        <Layouts.Mobile/>
    )
}