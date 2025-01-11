import './SelectElement.css'
import { StyleConfig } from '../../interfaces'
import React from 'react'

interface SelectElementProps {
    elementList: string[]
    value: string
    onChange: (newValue: string) => void
    disabled?: boolean
    style: StyleConfig
}

const SelectElement = ({ elementList, onChange, value, style, disabled }: SelectElementProps) => {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (onChange) onChange(event.target.value)
    }

    if (elementList)
        return (
            <div className='SelectElement' style={style}>
                <select onChange={handleChange} disabled={disabled} value={value ? value : '...'}>
                    <option value={"..."} disabled hidden>...</option>
                    {elementList.map(element => <Option value={element} key={element} />)}
                </select>
            </div>
        )
}

interface OptionProps {
    value: string
}

const Option = ({ value }: OptionProps) => {
    return <option value={value}>{value}</option>
}

export default SelectElement