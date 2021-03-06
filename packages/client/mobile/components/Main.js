import { useContext } from 'react'
import { UnauthenticatedRoutes, AuthenticatedRoutes } from "../routes"
import { AuthenticationContext } from '../../shared/authentication/contexts'

export default function Main(prop) {
    const { state: { isAuthenticated } } = useContext(AuthenticationContext)

    function getRoutes() {
        if (isAuthenticated) {
            return AuthenticatedRoutes
        } else {
            return UnauthenticatedRoutes
        }
    }

    const Route = getRoutes()
    return (
        <Route/>
    )
}