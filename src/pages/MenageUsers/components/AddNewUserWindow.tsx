import { useState, KeyboardEvent } from 'react'
import Button from '../../../components/Button/Button'
import WindowOnTop from '../../../components/WindowOnTop/WindowOnTop'
import { useSetAlertBoxContext } from '../../../context/AlertContexProvider'
import userServices, { NewDBUserInterface } from '../../../services/userServices'
import TableSimple, { InputRow, SelectElementRow } from '../../../components/TableSimple/TableSimple'

interface AddNewUserWindowProps {
    /** funkcja która zamknie okno */
    closeWindow: () => void
    /** funkcja wykonująca się po poprawnym dodaniu użytkownika */
    reloadUserData: () => void
}

const AddNewUserWindow = ({ closeWindow, reloadUserData }: AddNewUserWindowProps) => {
    const setAlertBox = useSetAlertBoxContext()
    const [newUser, setNewUser] = useState<NewDBUserInterface>({
        id: '',
        email: '',
        first_name: '',
        last_name: '',
        role: 'user',
        password: '',
        password2: ''
    })

    const inputHandler = (key: keyof NewDBUserInterface, newValue: string) => {
        setNewUser((prev) => {
            return { ...prev, [key]: newValue }
        })
    }

    /** osbługa skrótów klawiszowych */
    const keyboardShortcuts = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            saveHandler()
        }
    }

    const saveHandler = () => {
        let emptyField = false
        Object.keys(newUser).forEach(key => {
            if (key === 'id') return
            if (newUser[key as keyof NewDBUserInterface] === '')
                emptyField = true
        })
        if (emptyField) {
            setAlertBox({ type: 'warning', text: 'Nie uzupełniono wszystkich danych.' })
            return
        }
        if (newUser.password !== newUser.password2) {
            setAlertBox({ type: 'warning', text: 'Podane hasła nie są jednakowe.' })
            return
        }
        userServices
            .createUser(setAlertBox, newUser)
            .then(() => {
                reloadUserData()
                closeWindow()
            })
    }

    return <WindowOnTop title=' Dodaj użytkownika' style={{ minWidth: 400 }} closeWindow={closeWindow}>
        <div className='AddNewUserWindow' onKeyDown={(e) => keyboardShortcuts(e)}>
            <div className='DataSection'>
                <TableSimple type='None'>
                    <InputRow name='Email' value={newUser.email} onChange={(newValue) => inputHandler('email', newValue)} />
                    <InputRow name='Imię' value={newUser.first_name} onChange={(newValue) => inputHandler('first_name', newValue)} />
                    <InputRow name='Nazwisko' value={newUser.last_name} onChange={(newValue) => inputHandler('last_name', newValue)} />
                    <SelectElementRow<NewDBUserInterface['role']> name='Typ użytkownika' value={newUser.role} onChange={(newValue) => inputHandler('role', newValue)} elemetList={['user', 'powerUser', 'admin']} />
                    <InputRow name='Hasło' type='password' value={newUser.password} onChange={(newValue) => inputHandler('password', newValue)} />
                    <InputRow name='Powtórz hasło' type='password' value={newUser.password2} onChange={(newValue) => inputHandler('password2', newValue)} />
                </TableSimple>
            </div>
            <div className='WindowOnTopButtonSection'>
                <Button name='Anuluj' buttonHandler={closeWindow} style={{ width: '50%' }} />
                <Button name='Zapisz' buttonHandler={saveHandler} style={{ width: '50%' }} />
            </div>
        </div>
    </WindowOnTop>
}

export default AddNewUserWindow