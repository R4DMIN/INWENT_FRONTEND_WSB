import { Link } from 'react-router-dom'
import './MenuButton.css'

interface MenuButtonProps {
    /** tekst do wyświetlenia na przycisku */
    text: string;
    /** ikona do wyświetlenia */
    icon: string;
    /** url do którego ma prowadzić */
    url: string;
}

const MenuButton = ({ text, icon, url }: MenuButtonProps) => {
    return (
        <Link to={url} className='NavMenuButton'>
            <div className='NavMenuButton' >
                <MenuButtonIcon icon={icon} />
                <MenuButtonText text={text} />
            </div>
        </Link>
    )
}

interface MenuButtonActionProps {
    /** tekst do wyświetlenia na przycisku */
    text: string,
    /** ikona do wyświetlenia */
    icon: string,
    /** akcja do wykonania po kliknięciu  */
    onClick: () => void
}

const MenuButtonAction = ({ text, icon, onClick }: MenuButtonActionProps) => {
    return <div className='NavMenuButton' onClick={onClick} >
        <MenuButtonIcon icon={icon} />
        <MenuButtonText text={text} />
    </div>
}

interface MenuButtonIcon {
    icon: string
}

const MenuButtonIcon = ({ icon }: MenuButtonIcon) => {
    return (
        <div className='NavMenuButtonIcon'>
            <img src={icon} alt='icon_img'></img>
        </div >
    )
}

interface MenuButtonText {
    text: string
}

const MenuButtonText = ({ text }: MenuButtonText) => {
    return (
        <div className='NavMenuButtonText'>
            {text}
        </div>
    )
}

export { MenuButton, MenuButtonAction }