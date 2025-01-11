import { ReactNode, useState } from 'react'
import './LoggedInUser.css'
import ChangeLocation from '../../ChangeLocation/ChangeLocation.tsx'
import { useClearUserContext, useUserContextRead } from '../../../context/UserContextProvider.tsx'
import loginServices from '../../../services/loginServices.tsx'
import { useSetAlertBoxContext } from '../../../context/AlertContexProvider.tsx'

const LoggedInUser = () => {
    const [windowOnTop, setWindowOnTop] = useState<null | ReactNode>(null)
    const user = useUserContextRead()
    const clearUser = useClearUserContext()
    const setAlert = useSetAlertBoxContext()

    const openChangeLocation = () => {
        setWindowOnTop(<ChangeLocation closeHandler={() => setWindowOnTop(null)} />)
    }

    const logoutHandler = () => {
        loginServices.logout(setAlert, clearUser)
    }

    return (
        <>
            {windowOnTop && windowOnTop}
            <div className='LoggedInUserInfo'>
                <div className='Logout'>
                    {user && <button onClick={logoutHandler}>Wyloguj</button>}
                </div>
                <div className='UserName'>
                    {user?.firstName} {user?.lastName}
                </div>
                <div className='SelectedLocation'>
                    <div>
                        {user?.selectedBusinessUnit ? '' + user.selectedBusinessUnit.short_name : 'Nie wybrano BU '}
                        <button onClick={openChangeLocation}>{'(zmień)'}</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoggedInUser