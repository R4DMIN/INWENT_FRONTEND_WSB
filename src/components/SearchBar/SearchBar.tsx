import './SearchBar.css'
import lens from '../../assets/icons/magnifying-glass-solid.svg'
import { useState, KeyboardEvent } from 'react'

interface SearchBarProps {
    searchHandler: (value: string) => void
    width?: number
    placeholder?: string
}

const SearchBar = ({ searchHandler, width = 200, placeholder = 'Wyszukaj...' }: SearchBarProps) => {

    const [value, setValue] = useState<string>('')

    const search = async () => {
        searchHandler(value)
        setValue('')
    }

    const keyboardShortcuts = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') search()
    }

    return (
        <div className='SearchBar' style={{ width: width }}>
            <div className='searchInput' style={{ width: width }}>
                <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={keyboardShortcuts}
                    placeholder={placeholder}
                />
                <img
                    src={lens}
                    alt='icon_img'
                    className='searchIcon'
                    onClick={search}
                />
            </div>
        </div>
    )
}

export default SearchBar