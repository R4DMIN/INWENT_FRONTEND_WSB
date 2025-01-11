import { useState } from 'react'
import { ColumnConfigInterface, DataKey } from '../Table/TableIntefaces'
import WindowOnTop from '../WindowOnTop/WindowOnTop'
import Button from '../Button/Button'
import './SelectColumns.css'

interface SelectColumnsProps<T> {
    closeWindow: () => void
    setSelected: (selectedKeys: DataKey<T>[]) => void
    selected: DataKey<T>[]
    possibleColumnConfig: ColumnConfigInterface<T>[]
}

const SelectColumns = <T extends { id: string }>({
    closeWindow,
    setSelected,
    selected,
    possibleColumnConfig,
}: SelectColumnsProps<T>) => {
    const [keyList, setKeyList] = useState(selected) // lista wybranych kluczy
    const [selectedKey, setSelectedKey] = useState<DataKey<T> | null>(null) // zaznaczony klucz

    const addKey = () => {
        if (selectedKey && !keyList.includes(selectedKey)) {
            setKeyList((prev) => [...prev, selectedKey])
        }
    }

    const removeKey = () => {
        if (selectedKey && keyList.includes(selectedKey)) {
            setKeyList((prev) => prev.filter((key) => key !== selectedKey))
        }
    }

    const moveUp = () => {
        if (!selectedKey) return
        setKeyList((prev) => {
            const index = prev.indexOf(selectedKey)
            if (index > 0) {
                const newOrder = [...prev]
                newOrder[index] = prev[index - 1]
                newOrder[index - 1] = prev[index]
                return newOrder
            }
            return prev
        })
    }

    const moveDown = () => {
        if (!selectedKey) return
        setKeyList((prev) => {
            const index = prev.indexOf(selectedKey)
            if (index < prev.length - 1) {
                const newOrder = [...prev]
                newOrder[index] = prev[index + 1]
                newOrder[index + 1] = prev[index]
                return newOrder
            }
            return prev
        })
    }

    // potwierdź wybór i zwróć
    const confirmSelect = () => {
        setSelected(keyList)
        closeWindow()
    }

    const handleSelectKey = (key: DataKey<T>) => {
        setSelectedKey(key)
    }

    return (
        <WindowOnTop title='Wybierz kolumny' closeWindow={closeWindow}>
            <div className='WindowOnTopContent'>
                <div className='SelectColumns'>
                    {/* Lista używanych kolumn */}
                    <div className='List'>
                        <h3>Aktywne kolumny</h3>
                        <ul>
                            {keyList.map((key) => {
                                const column = possibleColumnConfig.find((e) => e.key === key)
                                return (
                                    <li
                                        key={key}
                                        onClick={() => handleSelectKey(key)}
                                        className={`ListItem ${key === selectedKey ? 'SelectedItem' : ''}`}
                                    >
                                        {column?.header}
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <div className='Buttons'>
                        <Button name='&#x21e7;' buttonHandler={moveUp} style={{ fontSize: 25, padding: 0 }} />
                        <Button name='Dodaj' buttonHandler={addKey} />
                        <Button name='Usuń' buttonHandler={removeKey} />
                        <Button name='&#x21e9;' buttonHandler={moveDown} style={{ fontSize: 25, padding: 0 }} />
                    </div>

                    {/* Lista nie używanych kolumn */}
                    <div className='List'>
                        <h3>Dostępne kolumny</h3>
                        <ul>
                            {possibleColumnConfig
                                .filter((e) => !keyList.includes(e.key))
                                .map((e) => (
                                    <li
                                        key={e.key}
                                        onClick={() => handleSelectKey(e.key)}
                                        className={`ListItem ${e.key === selectedKey ? 'SelectedItem' : ''}`}
                                    >
                                        {e.header}
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className='WindowOnTopButtonSection' >
                <Button name='Anuluj' buttonHandler={() => closeWindow()} />
                <Button name='Potwierdź' buttonHandler={confirmSelect} />
            </div>
        </WindowOnTop>
    )
}

export default SelectColumns
