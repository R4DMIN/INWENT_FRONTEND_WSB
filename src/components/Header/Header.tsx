import './Header.css'
import LoggedInUser from './LoggedInUser/LoggedInUser.tsx'
import logo from '../../assets/logo.png'

const Header = () => {

    return (
        <div className='appHeader'>
            <div className='logo'>
                <img src={logo} alt='logo placeholder' />
            </div>
            
            <LoggedInUser />
        </div>
    )
}

export default Header