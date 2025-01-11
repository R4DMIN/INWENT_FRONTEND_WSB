import './TableSimple.css'
import { ReactNode } from 'react'
import InputAutoComplete from '../InputAutoComplete/InputAutoComplete.tsx';

interface TableSimpleProps {
    /**nagłowek tabeli wyświetlany nad danymi*/
    title?: string;
    children: ReactNode;
    /** określa styl tabeli (domyślnie = 'Line')
     * ```
     * 'Line' - kolejne rzędy odzielone linią 
     * ```
     * 'Color' - naprzemienne kolory
    */
    type?: 'Line' | 'Color' | 'None';
}
const TableSimple = ({ title, children, type = 'Line' }: TableSimpleProps) => {
    return <div className='TableSimple'>
        {title && <h3>{title}</h3>}
        <table className={type}>
            <tbody>
                {children}
            </tbody>
        </table>

    </div>
}

interface DataRowProps {
    /**Wyświetlana nazwa klucza*/
    name: string;
    /**Wartość klucza*/
    value?: string | number;
}
const DataRow = ({ name, value = '' }: DataRowProps) => {
    return <tr>
        <th className='Name'>
            {name}:
        </th>
        <th className='Value'>
            {value}
        </th>
    </tr>
}

interface InputRowProps {
    /** Wyświetlana nazwa klucza */
    name: string;
    /** Wartość klucza */
    value?: string;
    /** Funkcja onChange wartości klucza*/
    onChange(newValue: string): void;
    /** Opcjonalnie typ (aktualnie tylko password i text) */
    type?: 'password' | 'text'

}

const InputRow = ({ name, value = '', onChange, type = 'text' }: InputRowProps) => {
    return <tr>
        <th className='Name'>
            {name}:
        </th>
        <th className='Value'>
            <input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
        </th>
    </tr>
}

interface InputAutoCompleteRowProps {
    /** Wyświetlana nazwa klucza */
    name: string;
    /** Wartość klucza */
    value: string;
    /** Funkcja onChange wartości klucza*/
    onChange(newValue: string): void;
    /** tablica słów do uzupełnienia  */
    hintsArray: string[]

}

const InputAutoCompleteRow = ({ name, value, onChange, hintsArray }: InputAutoCompleteRowProps) => {
    return <tr>
        <th className='Name'>
            {name}:
        </th>
        <th className='Value'>
            <InputAutoComplete value={value} onChange={(newValue) => onChange(newValue)} hintsArray={hintsArray} />
        </th>
    </tr>
}

interface TextAreaRowProps {
    /**Wyświetlana nazwa klucza*/
    name: string;
    /**Wartość klucza*/
    value: string;
    /** */
    onChange(newValue: string): void;
    /** true jeżeli ma być blokada wprowadzania danych */
    disabled?: boolean;
    /** ilość wierszy, domyślnie = 4  */
    rows?: number
    /** ilość kolumn, domyślnie = 25 */
    cols?: number
}
const TextAreaRow = ({ name, value, onChange, disabled = false, rows = 4, cols = 25 }: TextAreaRowProps) => {

    if (!onChange) return

    return <tr>
        <th className='Name'>
            {name}:
        </th>
        <th className='Value'>
            <textarea
                value={value}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
                rows={rows}
                cols={cols}
                maxLength={rows * (cols + 2)}
            ></textarea>
        </th>
    </tr>
}

interface SelectElementRowProps<T extends string = string> {
    /** Wyświelana nazwa klucza */
    name: string
    /** Wartość klucza */
    value?: string;
    /** funkcja wykonująca się po zmianie wartości przyjmująca (newValue) */
    onChange(newValue: T): void
    /** Lista elementów do wyboru */
    elemetList: T[]
}

const SelectElementRow = <T extends string = string>({ name, value = '', onChange, elemetList }: SelectElementRowProps<T>) => {
    return <tr>
        <th className='Name'>
            {name}:
        </th>
        <th className='Value Select'>
            <select autoFocus={true} onChange={(event) => onChange(event.target.value as T)} value={value} >
                <option value={''} disabled hidden>--Wybierz--</option>
                {elemetList.map(element => <option key={element} value={element} >{element}</option>)}
            </select>
        </th>
    </tr>
}

export default TableSimple
export { DataRow, InputRow, TextAreaRow, SelectElementRow, InputAutoCompleteRow } 