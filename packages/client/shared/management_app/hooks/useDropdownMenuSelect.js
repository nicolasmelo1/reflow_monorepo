import { useState } from 'react'
import { useClickedOrPressedOutside } from '../../core/hooks'

/**
 * This hook is responsible for handling the dropdown menu selectables. For example `numberFormatType` can be edited
 * directly in the dropdown menu so the user doesn't need to open a modal to edit stuff in the field.
 * Those menus works in a similar fashion than notion, instead of using a simple select in the little modal we will
 * open another dropdown at the side of the button (left or right, this is calculated automatically.)
 * 
 * Generally you will create your own menu components, but this will have helpful functions so you can create dozens
 * selectables in the same component and it will just work.
 * 
 * @param {object} params - The params that this hook recieves
 * @param {{ current: HTMLElement }} [params.buttonRef=undefined] - REQUIRED ONLY FOR WEB. The reference to the button, 
 * this is the object from the `useRef()`, you probably know how useRef() work by now. You just send this ref directly.
 * @param {{ current: HTMLElement }} [param.menuRef=undefined] - REQUIRED ONLY FOR WEB. The reference to the menu 
 * container, this is the container with all of the options. This is the object from the `useRef()`, you probably 
 * know how useRef() work by now. You just send this ref directly.
 * @param {boolean} [isMenuOpen=false] - Completly optional, is the menu open or closed by default in the first render?
 * 
 * @returns {{
 *      isOpen: boolean,
 *      onOpenMenu: (isMenuOpen: boolean) => void,
 *      menuPosition: {
 *          x: number,
 *          y: number
 *      }
 * }} - Returns an object containing the `isOpen` boolean state, the onOpenMenu function to open or close the menu
 * and an object called `menuPosition` because it's the 'x' and 'y' position you should render the menu at.
 */
export default function useDropdownMenuSelect({
    buttonRef=undefined,
    menuRef=undefined,
    isMenuOpen=false
}) {
    const [isOpen, setIsOpen] = useState(isMenuOpen)
    const [menuPosition, setMenuPosition] = useState(null)
    
    if (process.env['APP'] === 'web') {
        useClickedOrPressedOutside({ ref: menuRef, callback: onUserClickOutsideMenu})
    }

    /** 
     * / * WEB ONLY * /
     * 
     * When the user clicks outside of the menu AND HE DID NOT CLICK THE MENU BUTTON
     * then we will close the menu.
     * 
     * @param {MouseEvent} e - The mouse event recieved from the browser because of the document
     * click.
     */
    function onUserClickOutsideMenu(e) {
        if (process.env['APP'] === 'web') {
            if (buttonRef.current && !buttonRef.current.contains(e.target)) {
                setIsOpen(false)
            }
        }
    }

    /**
     * This will handle two things:
     * 
     * - First, simply, it will open and close the menu, so it just change the `isOpen` state.
     * - Second, WEB ONLY, it defines the 'x' and 'y' position we should render the menu on the screen.
     * By default the dropdown select menu has a fixed position. This means it won't respect
     * scroll, overflow and all that. So we need to have a 'x' and 'y' position where we should
     * render the element. This exactly what we calculate here.
     * 
     * @param {boolean} isMenuOpen - Is the menu open or closed? by default it is the opposite of the
     * `!isOpen` state.
     */
    function onOpenMenu(isMenuOpen=!isOpen) {
        setIsOpen(isMenuOpen)
        if (process.env['APP'] === 'web' && isMenuOpen === true) {
            setTimeout(() => {
                if (buttonRef.current && menuRef.current) {
                    const menuRect = menuRef.current.getBoundingClientRect()
                    const menuButtonRect = buttonRef.current.getBoundingClientRect()
                    const rightOfMenuButton = menuButtonRect.width + menuButtonRect.x
                    const hasSpaceOnTheRight = rightOfMenuButton + menuRect.width < window.innerWidth
                    
                    let yPosition = menuButtonRect.y - (menuRect.height / 2)
                    // yPosition is bigger than the height of the content
                    if ((yPosition + menuRect.height) > window.innerHeight) {
                        yPosition = yPosition - ((yPosition + menuRect.height) - window.innerHeight)
                    } else if (yPosition < 0) {
                        yPosition = 0
                    }
                    if (hasSpaceOnTheRight) {
                        const position = {
                            x: rightOfMenuButton + 2,
                            y: yPosition
                        }
                        setMenuPosition(position)
                    } else {
                        const position = {
                            x: menuButtonRect.x - menuRect.width,
                            y: yPosition
                        }
                        setMenuPosition(position)
                    }
                }
            }, 1)
        }
    }

    return {
        isOpen,
        onOpenMenu,
        menuPosition
    }
}