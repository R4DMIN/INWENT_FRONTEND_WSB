import './Collapsible.css'
import { ReactNode, useState } from 'react'
import arrowUp from './../../assets/icons/chevron-up-solid.svg'
import arrowDown from './../../assets/icons/chevron-down-solid.svg'

interface CollapsibleProps {
    /** Tytuł wyświetlany na belce do rozwijania  */
    title: string,
    /** Treść do wyświetlenia po rozwinięciu komponentu */
    children: ReactNode;
}

const Collapsible = ({ title, children }: CollapsibleProps) => {
    const [open, setOpen] = useState<boolean>(false)

    return <div className='Collapsible'>
        <div className='Bar' onClick={() => setOpen(!open)}>
            <div>{title}</div>
            {open
                ? <img alt='arrowUp' src={arrowUp} width='20px' height='20px' />
                : <img alt='arrowDown' src={arrowDown} width='20px' height='20px' />
            }
        </div>
        {open && <div className='Concent'>
            {children}
        </div>}
    </div>
}

export default Collapsible