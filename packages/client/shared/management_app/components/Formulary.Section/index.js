import Layouts from './layouts'

export default function FormularySection(props) {
    return process.env['APP'] === 'web' ? (
        <Layouts.Web
        section={props.section}
        />
    ) : (
        <Layouts.Mobile/>
    )
}