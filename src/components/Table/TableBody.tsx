import { Link } from 'react-router-dom'
import { ColumnConfigListInterface, ColumnConfigInterface, DataArray } from './TableIntefaces'

interface TableBodyProps<T> {
    columnsConfig: ColumnConfigListInterface<T>
    data: DataArray<T>
    checkBoxChangeHandler: (id: string) => void
    selectedId: string | null
    checBoxSelected: string[]
    selectHandler: (id: string) => void
}

const TableBody = <T extends { id: string }>({ columnsConfig, data, checkBoxChangeHandler, selectedId, checBoxSelected, selectHandler }: TableBodyProps<T>) => {
    return (
        <tbody>
            {data.map(dataRow => <DataRow
                key={dataRow.id}
                data={dataRow}
                columnsConfig={columnsConfig}
                checBoxHandler={() => checkBoxChangeHandler(dataRow.id)}
                checkBoxSelect={checBoxSelected.includes(dataRow.id) ? true : false}
                select={dataRow.id === selectedId}
                selectHandler={() => selectHandler(dataRow.id)}
            />)}
        </tbody>
    )
}

interface DataRowProps<T> {
    data: T
    columnsConfig: ColumnConfigListInterface<T>
    checBoxHandler: () => void
    checkBoxSelect: boolean
    selectHandler: () => void
    select: boolean
}

const DataRow = <T extends { id: string }>({ data, columnsConfig, checBoxHandler, select, checkBoxSelect, selectHandler }: DataRowProps<T>) => {
    /** zwraca komurkę w zależności od typu columny */
    const cell = (column: ColumnConfigInterface<T>) => {
        //jeżeli jest checboxem  
        if (column.key === 'checkbox')
            return <input
                type='checkbox'
                checked={checkBoxSelect}
                onChange={checBoxHandler}
            />

        //jeżeli jest linkiem
        if (column.link) {
            let state: string | undefined = ''
            const returKeyState = column.link.returnKeyState
            if (column.link.state) state = column.link.state
            else if (column.link.dataKeyState) state = String(data[column.link.dataKeyState])
            return <Link to={column.link.to} state={{ [returKeyState]: state }}>{String(data[column.key])}</Link>
        }

        if (column.boolean) {
            if (data[column.key] === undefined) return ''
            else if (data[column.key]) return 'true'
            else return 'false'
        }

        //jeżeli jest przyciskiem
        if (column.button)
            return <button onClick={column.button.onClick}>
                {column.button.text}
            </button>

        //jeżeli jest tekstem 
        return <>{data[column.key]}</>
    }

    return (
        <tr onClick={selectHandler}>
            {columnsConfig.map(column => <td
                key={column.key}
                style={column.style}
                className={select ? 'Selected' : checkBoxSelect ? 'checBoxSelect' : ''}>
                {cell(column)}
            </td>)}
        </tr>
    )
}

export default TableBody