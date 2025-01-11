import { useState, KeyboardEvent } from 'react'
import Button from '../../../components/Button/Button'
import WindowOnTop from '../../../components/WindowOnTop/WindowOnTop'
import { useSetAlertBoxContext } from '../../../context/AlertContexProvider'
import userServices, { DBUserInterface } from '../../../services/userServices'
import TableSimple, { InputRow, SelectElementRow } from '../../../components/TableSimple/TableSimple'

interface EditUserWindowProps {
    /** funkcja która zamknie okno */
    closeWindow: () => void
    /** funkcja wykonująca się po poprawnym dodaniu użytkownika */
    reloadUserData: () => void
    /** dane użytkownika */
    user: DBUserInterface
}

const EditUserWindow = ({ closeWindow, reloadUserData, user }: EditUserWindowProps) => {
    const setAlert = useSetAlertBoxContext()
    const [editedUser, setEditedUser] = useState<DBUserInterface>(user)

    /** osbługa inputów*/
    const inputHandler = (key: keyof DBUserInterface, newValue: string) => {
        setEditedUser((prev) => {
            return { ...prev, [key]: newValue }
        })
    }

    /** osbługa skrótów klawiszowych */
    const keyboardShortcuts = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            saveUserHandler()
        }
    }

    const saveUserHandler = () => {
        userServices
            .updateUser(setAlert, editedUser.id, editedUser)
            .then(() => {
                reloadUserData()
                closeWindow()
            })
    }

    return <WindowOnTop title='Edytuj użytkownika' style={{ minWidth: 400 }} closeWindow={closeWindow}>
        <div className='AddNewUserWindow' onKeyDown={(e) => keyboardShortcuts(e)}>
            <div className='DataSection'>
                <TableSimple type='None'>
                    <InputRow name='Email' value={editedUser.email} onChange={(newValue) => inputHandler('email', newValue)} />
                    <InputRow name='Imię' value={editedUser.first_name} onChange={(newValue) => inputHandler('first_name', newValue)} />
                    <InputRow name='Nazwisko' value={editedUser.last_name} onChange={(newValue) => inputHandler('last_name', newValue)} />
                    <SelectElementRow<DBUserInterface['role']> name='Typ użytkownika' value={editedUser.role} onChange={(newValue) => inputHandler('role', newValue)} elemetList={['user', 'powerUser', 'admin']} />
                </TableSimple>
            </div>
            <div className='WindowOnTopButtonSection'>
                <Button name='Anuluj' buttonHandler={closeWindow} style={{ width: '50%' }} />
                <Button name='Zapisz' buttonHandler={saveUserHandler} style={{ width: '50%' }} />
            </div>
        </div>
    </WindowOnTop >
}

export default EditUserWindow