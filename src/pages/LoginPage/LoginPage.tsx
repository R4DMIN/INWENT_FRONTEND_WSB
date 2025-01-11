import './LoginPage.css'
import { useState, KeyboardEvent, useEffect } from 'react'
import Button from '../../components/Button/Button'
import loginPhoto from '../../assets/loginphoto2.jpg'
import logo from '../../assets/logo.png'
import { Link } from 'react-router-dom'
import loginServices from '../../services/loginServices'
import { useSetAlertBoxContext } from '../../context/AlertContexProvider'
import { useSetUserContext } from '../../context/UserContextProvider'

const LoginPage = () => {

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const setAlert = useSetAlertBoxContext()
    const setUser = useSetUserContext()

    const loginHandler = (email: string, password: string) => {
        if (email === '' || password === '')
            setAlert({ type: 'warning', text: 'Nie wprowadzono danych logowania.' })
        else
            loginServices
                .login(email, password, setAlert)
                .then(() => {
                    loginServices.getUser(setAlert, setUser)
                })
    }

    /** osbługa skrótów klawiszowych */
    const keyboardShortcuts = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            loginHandler(email, password)
        }
    }

    useEffect(() => {
        loginServices.checkAuthToken(setAlert, setUser)
    }, [])

    return <div className='LoginPage' onKeyDown={(e) => keyboardShortcuts(e)}>
        <div className='Photo'>
            <img src={loginPhoto} alt='zdjęcie' width={500} height={500} />
        </div>
        <div className='Form'>
            <div className='Logo'>
                <img src={logo} alt='user' height={70} />
            </div>
            <div className='Input'>
                <input placeholder='email@inwent.pl' value={email} onChange={(e) => setEmail(e.target.value)}></input>
                <input type='password' placeholder='hasło' value={password} onChange={(e) => setPassword(e.target.value)}></input>
            </div>
            <div className='Remember'>
                <input type='checkbox' />Zapamiętaj mnie
            </div>
            <div className='Button'>
                <Button name='Zaloguj' buttonHandler={() => loginHandler(email, password)} style={{ width: '280px', height: '40px', fontSize: '16px' }} />
            </div>
            <div className='Restart'>
                <Link to='/'>Zapomniałeś hasła?</Link>
            </div>


        </div>
    </div >
}

export default LoginPage