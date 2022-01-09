import { useState } from 'react'
import Layouts from './layouts'

export default function ManagementApp(props) {
    const [isFormularyOpen, setIsFormularyOpen] = useState(false)
    
    function onOpenFormulary(isOpen=null) {
        if (isOpen !== null) {
            setIsFormularyOpen(isOpen)
        } else {
            setIsFormularyOpen(!isFormularyOpen)
        }
    }

    return process.env['APP'] === 'web' ? (
        <Layouts.Web
        isFormularyOpen={isFormularyOpen}
        onOpenFormulary={onOpenFormulary}
        />
    ) : (
        <Layouts.Mobile/>
    )
}