import Layouts from './layouts'

export default function FormularyFieldId(props) {
    return process.env['APP'] === 'web' ? (
        <Layouts.Web
        types={props.types}
        field={props.field}
        />
    ) : (
        <Layouts.Mobile/>
    )
}