import Layouts from './layouts'


function Sidebar(props) {
    return process.env['APP'] === 'web' ? (
        <Layouts.Web/>
    ) : (
        <Layouts.Mobile/>
    )
}


export default Sidebar