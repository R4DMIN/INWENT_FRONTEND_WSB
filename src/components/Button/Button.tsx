import './Button.css'
import { StyleConfig } from '../../interfaces'


interface buttonProps {
    /** tekst wyświetlany na przycisku */
    name: string
    /** funkcja którą przycisk ma wywołać */
    buttonHandler: () => void
    /** opcjonalne ikonka która ma sie wyświetlać zamiast przycisku / napisu */
    icon?: string
    /** custom css styles */
    style?: StyleConfig
    //** argument opcjonalny jeżeli true to przycisk nieaktywny */
    disabled?: boolean
}

const Button = ({ name, buttonHandler, icon, style, disabled = false }: buttonProps) => {

    if (icon) return <div className='IconButton' style={style}><button onClick={buttonHandler} disabled={disabled}><img src={icon} alt='icon' /></button></div>
    return <button className='TextButton' onClick={buttonHandler} style={style} disabled={disabled}>{name}</button>
}

export default Button