import { emailValidation } from '../../../../../shared/utils'
import Layouts from './layouts'

export default function FormularyFieldEmail(props) {
    /**
     * WHile the user is typing we will check if the email is valid or not, if it is then we will be able to save the data 
     * in the database. Othewise we will not be able to save the data.
     */
    function onChangeValue(email) {
        const isValidEmail = emailValidation(email)
    }

    return process.env['APP'] === 'web' ? (
        <Layouts.Web
        types={props.types}
        field={props.field}
        onChangeValue={onChangeValue}
        />
    ) : (
        <Layouts.Mobile/>
    )
}
