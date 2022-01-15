import Layouts from './layouts'

export default function FormularyFieldFormula(props) {
    return process.env['APP'] === 'web' ? (
        <Layouts.Web
        types={props.types}
        field={props.field}
        />
    ) : (
        <Layouts.Mobile/>
    )
}
