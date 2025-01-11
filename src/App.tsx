import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header/Header.tsx'
import Nav from './components/Nav/Nav.tsx'
import Footer from './components/Footer/Footer.tsx'
import { UserContextProvider, useUserContextLogged } from './context/UserContextProvider.tsx'
import { AlertBoxContextProvider } from './context/AlertContexProvider.tsx'
import DevicesTable from './pages/DevicesTable/DeviceTable.tsx'
import DevicePage from './pages/DevicePage/DevicePage.tsx'
import Inventory from './pages/Inventory/Inventory.tsx'
import ManageLocation from './pages/ManageLocation/ManageLocation.tsx'
import MenageModels from './pages/MenageModels/MenageModels.tsx'
import Tools from './pages/Tools/Tools.tsx'
/* import NoPage from './pages/NoPage.tsx' */
import MenageBusinessUnits from './pages/MenageBusinessUnits/MenageBusinessUnits.tsx'
import LoginPage from './pages/LoginPage/LoginPage.tsx'
import AllertBox from './components/AllertBox/AllertBox.tsx'
import MenageUser from './pages/MenageUsers/MenageUsers.tsx'

const App = () => {
    return <UserContextProvider >
        <AlertBoxContextProvider >
            <div className='App'>
                <AllertBox />
                <AppBrowserRouter />
            </div>
        </AlertBoxContextProvider>
    </UserContextProvider>
}

const AppBrowserRouter = () => {
    const userLogged = useUserContextLogged()
    return <BrowserRouter>
        {userLogged
            ? <>
                <Header />
                <div className='AppBody'>
                    <Nav />
                    <div className='AppMain' >
                        <Routes>
                            <Route path="/deviceslist" element={<DevicesTable />} />
                            <Route path="/device" element={<DevicePage />} />
                            <Route path="/inventory" element={<Inventory />} />
                            <Route path="/mgrlocations" element={<ManageLocation />} />
                            <Route path="/mgrmodels" element={<MenageModels />} />
                            <Route path="/tools" element={<Tools />} />
                            <Route path="/mgrBU" element={<MenageBusinessUnits />} />
                            <Route path="/mgrusers" element={<MenageUser />} />
                            <Route path='/*' element={<Inventory />} />
                        </Routes>
                    </div>
                </div>
                <Footer />
            </>
            : <LoginPage />}
    </BrowserRouter>
}

export default App