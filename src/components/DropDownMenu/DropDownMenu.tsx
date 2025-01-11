import React from 'react'
import { useEffect, useState, useRef, ReactNode } from 'react'
import Button from '../Button/Button.tsx'
import './DropDownMenu.css'

interface DropDownMenuProps {
    icon?: string,
    text: string,
    side?: 'left' | 'right',
    children: ReactNode
}

const DropDownMenu = ({ icon, text, side = 'left', children }: DropDownMenuProps) => {

    const [isOpen, setIsOpen] = useState<boolean>(false)

    const dropDownMenuRef = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
        const mouseEvnentHandler = (e: MouseEvent) => {
            if (dropDownMenuRef.current && !dropDownMenuRef.current.contains(e.target as Node))
                setIsOpen(false)
        }
        document.addEventListener('mousedown', mouseEvnentHandler)

        return () => document.removeEventListener('mousedown', mouseEvnentHandler)
    })

    return <div className='DropDownMenu' ref={dropDownMenuRef}>
        <div className={'DropDownMenuContainer ' + (isOpen && 'IsOpen')}>
            <Button icon={icon} name={`${text} \u2193`} buttonHandler={() => setIsOpen(!isOpen)} />
            {isOpen &&
                <div className={'DownMenu ' + (side === 'left' ? 'OnLeft' : 'OnRight')} onClick={() => setIsOpen(!isOpen)}>
                    {children}
                </div>
            }
        </div>
    </div>
}

interface DropDownMenuButtonProps {
    text: string,
    buttonHandler(): void
    /** blokuje przycisk jeżeli true */
    disabled?: boolean
}

const DropDownMenuButton: React.FC<DropDownMenuButtonProps> = ({ text, buttonHandler, disabled = false }) => {

    return <div className='DropDownMenuButton'>
        <button disabled={disabled} onClick={buttonHandler}>{text}</button>
    </div>
}

export { DropDownMenu, DropDownMenuButton }