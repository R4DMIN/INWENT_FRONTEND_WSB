import { StyleConfig } from '../../interfaces'
import './WindowOnTop.css'
import { ReactNode, KeyboardEvent, useRef, useEffect } from 'react'
import errorIcon from '../../assets/icons/alert_error.png'
import infoIcon from '../../assets/icons/alert_info.png'
import warningIcon from '../../assets/icons/alert_warning.png'
import okIcon from '../../assets/icons/alert_ok.png'
import xmark from '../../assets/icons/xmark-solid-white.svg'

interface WindowOnTopProps {
    children: ReactNode
    title?: string
    style?: StyleConfig
    iconType?: 'ok' | 'warning' | 'error' | 'info'
    closeWindow?: () => void
}

const WindowOnTop = ({ children, title, style, iconType, closeWindow }: WindowOnTopProps) => {
    const focusRef = useRef<HTMLInputElement>(null)
    const keyboardShortcuts = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Escape' && closeWindow) closeWindow()
    }
    useEffect(() => {
        focusRef.current?.focus()
    }, [])

    const getIcon = (type: 'ok' | 'warning' | 'error' | 'info') => {
        switch (type) {
            case 'warning':
                return warningIcon
            case 'ok':
                return okIcon
            case 'error':
                return errorIcon
            case 'info':
                return infoIcon
        }
    }

    return (
        <div className='BackgroundBlur' onKeyDownCapture={(e) => keyboardShortcuts(e)} tabIndex={0} ref={focusRef}>
            <div className='WindowOnTop' style={style}>
                {title &&
                    <div className='TitleSection'>
                        {iconType && <div className='TitleIcon'><img src={getIcon(iconType)} alt='icon' height={35} width={35} /></div>}
                        <div className='Title'>{title}</div>
                        {closeWindow && <img src={xmark} onClick={closeWindow} style={{ cursor: 'pointer', height: 35, width: 35 }} />}
                    </div>}
                {children}
            </div>
        </div >
    )
}

export default WindowOnTop