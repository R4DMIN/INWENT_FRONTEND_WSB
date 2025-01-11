import { useState } from 'react'
import './Nav.css'
import { MenuButtonAction } from './MenuButton/MenuButton.tsx'
import MenuList, { NavButtonInterface } from './MenuList/MenuList.tsx'
import arrowRight from '../../assets/icons/chevron-right-solid.svg'
import arrowLeft from '../../assets/icons/chevron-left-solid.svg'
import laptopFileSolid from '../../assets/icons/laptop-file-solid.svg'
import barsSolid from '../../assets/icons/bars-solid.svg'
import houseLaptopSolid from '../../assets/icons/house-laptop-solid.svg'
import squareCheckRegular from '../../assets/icons/square-check-regular.svg'
import toolsSolid from '../../assets/icons/toolbox-solid.svg'
/* import userSolid from '../../assets/icons/user-solid.svg'
 */

const Nav = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(true)

    const buttonList: NavButtonInterface[] = [
        {
            text: 'Lista Urządzeń',
            icon: barsSolid,
            url: '/deviceslist',
        },
        {
            text: 'Inwentaryzacja',
            icon: squareCheckRegular,
            url: '/inventory',
        },
        {
            text: 'Zarządzaj Modelami',
            icon: laptopFileSolid,
            url: '/mgrmodels',

        },
        {
            text: 'Zarządzaj Lokalizacją',
            icon: houseLaptopSolid,
            url: '/mgrlocations',
        },
        {
            text: 'Narzędzia',
            icon: toolsSolid,
            url: '/tools',
            acces: ['powerUser', 'admin']
        },
        /*         {
                    text: 'Zarządzaj jednostką organizacyjną',
                    icon: barsSolid,
                    url: '/mgrBU',
                },
                {
                    text: 'Zarządzaj użytkownikami',
                    icon: userSolid,
                    url: '/mgrusers',
                } */
    ]

    return (
        <div className={'Nav ' + (isMenuOpen ? 'open' : 'close')} >
            <MenuList buttonList={buttonList} />
            {isMenuOpen
                ? < MenuButtonAction onClick={() => setIsMenuOpen(!isMenuOpen)} text='Ukryj' icon={arrowLeft} />
                : < MenuButtonAction onClick={() => setIsMenuOpen(!isMenuOpen)} text='Pokaż' icon={arrowRight} />
            }

        </div>
    )
}

export default Nav