import './AlertBoxYesNo.css'
import Button from '../Button/Button.tsx'
import WindowOnTop from '../WindowOnTop/WindowOnTop.tsx'

interface AlertBoxYesNoProps {
    /** nagłówek Alertu */
    title: string,
    /** treść alertu */
    message: string,
    /** opcjonalnie typ alertu, domyślnie 'info', dostępne opcje 'ok', 'warning', 'error' */
    type?: 'ok' | 'warning' | 'error' | 'info'
    /** funkcja która zamyka okno */
    closeWindow: () => void
    /** funkcja do obsługi alertu jako parametra zwraca boolean w zależności od wyboru użytkownika */
    actionHandler: () => void
    /** opcjonalny parametry do zmiany przyciksu zatwiedzającego */
    customYes?: string,
    /** opcjonalny parametry do zmiany przyciksu anulującego */
    customNo?: string
}

const AlertBoxYesNo = ({ title, message, type = 'info', closeWindow, actionHandler, customYes = 'Tak', customNo = 'Nie' }: AlertBoxYesNoProps) => {

    const onClick = () => {
        actionHandler()
        closeWindow()
    }

    return <WindowOnTop title={title} iconType={type} style={{ maxWidth: 500 }} closeWindow={closeWindow}>
        {message}
        <div className='WindowOnTopButtonSection'>
            <Button name={customNo} buttonHandler={() => closeWindow()} />
            <Button name={customYes} buttonHandler={() => onClick()} />
        </div>
    </WindowOnTop>
}

export default AlertBoxYesNo