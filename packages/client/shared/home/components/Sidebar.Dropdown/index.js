import { useState } from 'react'
import Layouts from './layouts'

export default function SidebarDropdown(props) {
    const [isOpen, setIsOpen] = useState(false)
    const [isHovering, setIsHovering] = useState(false)
    
    function onOpenOrCloseDropdown(isOpen) {
        setIsOpen(isOpen)
    }

    return process.env['APP'] === 'web' ? (
        <Layouts.Web
        isOpen={isOpen}
        isHovering={isHovering}
        setIsHovering={setIsHovering}
        onOpenOrCloseDropdown={onOpenOrCloseDropdown}
        workspace={props.workspace}
        nestingLevel={props.nestingLevel}
        />
    ) : (
        <Layouts.Mobile/>
    )
}