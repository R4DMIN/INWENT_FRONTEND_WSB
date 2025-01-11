import { useEffect, useState } from 'react'
import './AllertBox.css'
import errorIcon from '../../assets/icons/alert_error.png'
import infoIcon from '../../assets/icons/alert_info.png'
import warningIcon from '../../assets/icons/alert_warning.png'
import okIcon from '../../assets/icons/alert_ok.png'
import { AlertBoxType, useAlertBoxContext } from '../../context/AlertContexProvider.tsx'

const AllertBox = () => {
    const message = useAlertBoxContext()
    const [open, setOpen] = useState(false)

    const getIcon = (type: AlertBoxType) => {
        switch (type) {
            case 'Warning':
            case 'warning':
                return warningIcon
            case 'Ok':
            case 'ok':
                return okIcon
            case 'Error':
            case 'error':
                return errorIcon
            default:
                return infoIcon
        }
    }

    const showMessage = () => {
        if (message.text) {
            setOpen(true)
            const timer1 = setTimeout(hideMessage, 5000);
            return () => clearTimeout(timer1)
        }
    }

    const hideMessage = () => {
        setOpen(false)
    }

    useEffect(showMessage, [message])

    return (
        <div className='HeaderAlertPlaceholder'>
            <div className={`AlertBox  ${(open ? 'Open' : 'Close')} ${message.type}`}>
                <div className='AlertIcon'>
                    <img src={getIcon(message.type)} alt='icon' />
                </div>
                <div className='AlertMessage'>
                    {message.text}
                </div>
            </div>
        </div>
    )
}

export default AllertBox