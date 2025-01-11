import './MenuList.css'
import { MenuButton } from '../MenuButton/MenuButton.tsx'
import { RoleType, useUserContextRole } from '../../../context/UserContextProvider.tsx'

export interface NavButtonInterface {
    text: string,
    icon: string,
    url: string,
    acces?: RoleType[]
}

interface MenuListProps {
    /** lista przycisków do wyświetlenia 
     * text: wyświetlana nazwa
     * icon: wyświetlana ikona 
     * url: link pod który ma prowadzić
    */
    buttonList: NavButtonInterface[]
}

const MenuList = ({ buttonList }: MenuListProps) => {

    const userRole = useUserContextRole()

    return (
        <div className='MenuList'>
            {buttonList.map((button => (!button.acces || button.acces?.includes(userRole ? userRole : 'user')) && <MenuButton key={button.text} text={button.text} icon={button.icon} url={button.url} />))}
        </div>
    )
}

export default MenuList