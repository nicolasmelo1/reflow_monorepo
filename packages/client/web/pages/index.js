import { useRouter } from "next/router"
import { useContext, useEffect } from "react"
import { paths } from "../../shared/core/utils/constants"
import { HomeDefaultsContext } from "../../shared/home/contexts"
import { Home } from "../components"

export default function Index(props) {
    const {state: { selectedApp, selectedArea } } = useContext(HomeDefaultsContext)
    const router = useRouter()

    useEffect(() => {
        if (selectedApp !== null && selectedArea.uuid !== null) {
            router.push(paths.app.asUrl.replace('{workspaceUUID}', selectedArea.uuid).replace('{appUUID}', selectedApp))
        } else if (selectedArea.uuid !== null) {
            router.push(paths.workspace.asUrl.replace('{workspaceUUID}', selectedArea.uuid))
        }
    }, [selectedArea, selectedApp])
    
    return <Home/>
}
