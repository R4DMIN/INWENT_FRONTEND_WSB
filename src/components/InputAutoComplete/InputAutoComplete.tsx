import { useState, useEffect, useRef, FocusEvent, KeyboardEvent } from 'react'
import './InputAutoComplete.css'

interface InputAutoCompleteProps {
    /** wartość */
    value: string
    /** wykonaj przy zmianie wartości */
    onChange(newValue: string): void
    /** tablica słów do uzupełnienia  */
    hintsArray: string[]
}

const InputAutoComplete = ({ value, onChange, hintsArray }: InputAutoCompleteProps) => {
    const [inputFocus, setInputFocus] = useState(false)
    const [selected, setSelected] = useState(0)

    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => setSelected(0), [hintsArray])
    hintsArray = hintsArray.filter((hint: string) => {
        if (hint === value) return false
        return hint.toLowerCase().includes(value.toLocaleLowerCase())
    })

    /** */
    const blurHandler = (e: FocusEvent<HTMLDivElement, Element>) => {
        const currentTarget = e.currentTarget
        requestAnimationFrame(() => {
            if (!currentTarget.contains(document.activeElement)) {
                setInputFocus(false)
            }
        })
    }

    const customSort = (strings: string[], priorityPrefix: string): string[] => {
        // Zmieniamy priorityPrefix na małe litery, aby porównania były case-insensitive
        const lowerPriorityPrefix = priorityPrefix.toLowerCase();

        // Sortujemy tablicę
        return strings.sort((a, b) => {
            const lowerA = a.toLowerCase();
            const lowerB = b.toLowerCase();
            // Sprawdź, czy `a` zaczyna się od prefiksu priorytetowego
            const isAPriority = lowerA.startsWith(lowerPriorityPrefix);
            // Sprawdź, czy `b` zaczyna się od prefiksu priorytetowego
            const isBPriority = lowerB.startsWith(lowerPriorityPrefix);
            // Jeśli `a` jest priorytetowe, a `b` nie jest, `a` powinno być przed `b`
            if (isAPriority && !isBPriority) {
                return -1;
            }
            // Jeśli `b` jest priorytetowe, a `a` nie jest, `b` powinno być przed `a`
            if (!isAPriority && isBPriority) {
                return 1;
            }
            // Jeśli oba elementy mają tę samą priorytetowość (lub oba nie są priorytetowe), sortuj alfabetycznie
            return lowerA.localeCompare(lowerB);
        });
    }
    hintsArray = customSort(hintsArray, value)

    /** */
    const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
        if (!hintsArray || !inputFocus) return
        if (e.key === 'ArrowDown')
            if (selected + 1 > hintsArray.length - 1) setSelected(0)
            else setSelected(selected + 1)
        if (e.key === 'ArrowUp')
            if (selected - 1 < 0) setSelected(hintsArray.length - 1)
            else setSelected(selected - 1)
        if (e.key === 'Enter')
            onChange(hintsArray[selected])
    }

    /** zwraca true albo false jeżeli są podpowiedzi do wyświetlenia  */
    const showHints = () => {
        if (hintsArray.length > 5 || hintsArray.length === 0 || !inputFocus) return false
        if (hintsArray.length === 1 && hintsArray[0] === value) return false
        return true
    }

    const maxWidth = inputRef.current ? inputRef.current.offsetWidth : 0


    return <div className='InputAutoComplete' onBlur={blurHandler} onKeyDown={(e) => handleKeyPress(e)} >
        <input
            ref={inputRef}
            value={value}
            onChange={e => onChange(e.target.value)}
            onFocus={() => setInputFocus(true)}
        />
        {showHints() && <HintsList
            hintsArray={hintsArray}
            onSelect={(selected) => onChange(selected)}
            setSelected={setSelected}
            selected={selected}
            maxWidth={maxWidth}
        />}
    </div >
}

interface HintsListProps {
    /** lista podpowiedzi do wyświetlenia */
    hintsArray: string[]
    /** akcja która się wykona po potwierdzeniu wyboru, jako parametr przyjmuje nową wartość */
    onSelect(newValue: string): void
    /** zwraca index podpowiedzi która ma się zaznaczyć  */
    setSelected(newSelect: number): void
    /** wybrana podpowiedź  */
    selected: number
    maxWidth: number
}

const HintsList = ({ hintsArray, onSelect, setSelected, selected, maxWidth }: HintsListProps) => {

    return <div className='HintsList' style={{ maxWidth: maxWidth - 2 }}>
        {hintsArray.map((element, index) => {
            return <button
                key={index}
                onClick={() => onSelect(element)}
                onMouseEnter={() => setSelected(index)}
                className={selected === index ? 'Selected' : ''}
            >
                {element}
            </button>
        })}
    </div>
}

export default InputAutoComplete