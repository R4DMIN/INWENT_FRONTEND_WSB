import { useState, KeyboardEvent } from 'react'
import Button from '../../../components/Button/Button'
import WindowOnTop from '../../../components/WindowOnTop/WindowOnTop'
import { useSetAlertBoxContext } from '../../../context/AlertContexProvider'
import userServices from '../../../services/userServices'
import TableSimple, { InputRow } from '../../../components/TableSimple/TableSimple'

interface ResetPasswordWindowProps {
    /** funkcja która zamknie okno */
    closeWindow: () => void
    /** id użytkownika */
    id: string
    /** email użytkownika */
    email: string
}

const ResetPasswordWindow = ({ closeWindow, id, email }: ResetPasswordWindowProps) => {
    const setAlert = useSetAlertBoxContext()
    const [password, setPassword] = useState<string>('')
    const [password2, setPassword2] = useState<string>('')

    /** osbługa skrótów klawiszowych */
    const keyboardShortcuts = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            resetPasswordHandler()
        }
    }

    const resetPasswordHandler = () => {
        if (password === '') {
            setAlert({ type: 'warning', text: 'Nie podano nowego hasła.' })
            return
        }
        if (password !== password2) {
            setAlert({ type: 'warning', text: 'Wprowadzone hasła nie są jednakowe.' })
            return
        }

        userServices
            .ressetPassword(setAlert, id, password)
            .then(() => {
                closeWindow()
            })
    }

    return <WindowOnTop title={`Reset hasła ${email}`} style={{ minWidth: 400 }} closeWindow={closeWindow}>
        <div className='AddNewUserWindow' onKeyDown={(e) => keyboardShortcuts(e)}>
            <div className='DataSection'>
                <TableSimple type='None'>
                    <InputRow name='Hasło' type='password' value={password} onChange={(newValue) => setPassword(newValue)} />
                    <InputRow name='Powtórz hasło' type='password' value={password2} onChange={(newValue) => setPassword2(newValue)} />
                </TableSimple>
            </div>
            <div className='WindowOnTopButtonSection'>
                <Button name='Anuluj' buttonHandler={closeWindow} style={{ width: '50%' }} />
                <Button name='Zapisz' buttonHandler={resetPasswordHandler} style={{ width: '50%' }} />
            </div>
        </div>
    </WindowOnTop >
}

export default ResetPasswordWindow