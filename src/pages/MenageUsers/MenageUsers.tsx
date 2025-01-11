import { ReactNode, useEffect, useState } from 'react'
import Button from '../../components/Button/Button'
import Table from '../../components/Table/Table'
import { SetAlertType, useSetAlertBoxContext } from '../../context/AlertContexProvider'
import Loading from '../../components/Loading/Loading'
import userServices, { DBUserInterface } from '../../services/userServices'
import AddNewUserWindow from './components/AddNewUserWindow'
import EditUserWindow from './components/EditUser'
import ResetPasswordWindow from './components/ResetPasswordWindow'
import SelectBusinessUnit from '../../components/SelectBussinesUnit/SelectBussinesUnit'
import AlertBoxYesNo from '../../components/AlertBoxYesNo/AlertBoxYesNo'

const MenageUser = () => {
    const [loading, setLoading] = useState(false)
    const [userList, setUserList] = useState<DBUserInterface[]>([])
    const [windowOnTop, setWindowOnTop] = useState<null | ReactNode>(null)
    const [selected, setSelected] = useState<string | null>(null)
    const setAlertBox = useSetAlertBoxContext()

    const reloadUserData = () => {
        loadUsersList(setAlertBox)
    }

    const openNewUserWindow = () => {
        setWindowOnTop(<AddNewUserWindow closeWindow={() => setWindowOnTop(null)} reloadUserData={reloadUserData} />)
    }

    const openEditUserWindow = () => {
        if (!selected) return
        const selectedUserData = userList.filter((user) => user.id === selected)
        setWindowOnTop(<EditUserWindow closeWindow={() => setWindowOnTop(null)} reloadUserData={reloadUserData} user={selectedUserData[0]} />)
    }

    const openSelectBusinessUnitWindow = () => {
        if (!selected) return
        setWindowOnTop(<SelectBusinessUnit closeWindow={() => setWindowOnTop(null)} userID={selected} />)
    }

    const openResetPasswordWindow = () => {
        if (!selected) return
        const selectedUserData = userList.filter((user) => user.id === selected)[0]
        setWindowOnTop(<ResetPasswordWindow closeWindow={() => setWindowOnTop(null)} id={selectedUserData.id} email={selectedUserData.email} />)
    }

    const loadUsersList = (setAlertBox: SetAlertType) => {
        setLoading(true)
        userServices
            .getUsers(setAlertBox)
            .then((response) => setUserList(response))
            .finally(() => setLoading(false))
    }

    const deleteUser = (id: string) => {
        userServices
            .deleteUser(setAlertBox, id)
            .then(() => {
                setSelected(null)
                loadUsersList(setAlertBox)
            })
    }

    const handleDeleteUser = () => {
        if (!selected) return
        const selectedUserData = userList.filter((user) => user.id === selected)[0]
        setWindowOnTop(<AlertBoxYesNo
            title='Usuwanie użytkonika'
            message={`Czy na pewno chcesz usunąć użytkownika ${selectedUserData.first_name} ${selectedUserData.last_name}?`}
            closeWindow={() => setWindowOnTop(null)}
            actionHandler={() => deleteUser(selected)}
            type='warning'
        />)
    }

    useEffect(() => loadUsersList(setAlertBox), [setAlertBox])

    return <div className='TablePage'>
        {loading && <Loading />}
        {windowOnTop && windowOnTop}
        <div className='TablePageButtonSection'>
            <Button name='Dodaj użytkownika' buttonHandler={openNewUserWindow} />
            <Button name='Edytuj użtkownika ' buttonHandler={openEditUserWindow} disabled={selected ? false : true} />
            <Button name='Usuń uzytkownika' buttonHandler={handleDeleteUser} disabled={selected ? false : true} />
            <Button name='Restart Hasła' buttonHandler={openResetPasswordWindow} disabled={selected ? false : true} />
            <Button name='Wybierz jednostki organizacyjne' buttonHandler={openSelectBusinessUnitWindow} disabled={selected ? false : true} />
        </div>
        <Table
            columnConfig={[
                { key: 'id', header: 'ID' },
                { key: 'role', header: 'Typ użytkownika' },
                { key: 'email', header: 'Email' },
                { key: 'first_name', header: 'Imię' },
                { key: 'last_name', header: 'Nazwisko' },
                /* { key: 'business_unit_IDs', header: 'Jednostki organizacyjne' } */
            ]}
            data={userList}
            selectedId={selected}
            selectActionHandler={(id) => setSelected(id)}
        />
    </div>
}

export default MenageUser