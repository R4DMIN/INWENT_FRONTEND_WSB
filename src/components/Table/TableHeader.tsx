import { ColumnConfigListInterface, DataKey, Sort } from './TableIntefaces';
import { StyleConfig } from '../../interfaces.ts';

interface TableHeaderProps<T> {
    columnsConfig: ColumnConfigListInterface<T>
    sort: Sort<T> | null
    enableFilter: boolean
    inputFilterHandler: (dataKey: DataKey<T>, value: string) => void
    sortDataHandler: (columnKey: DataKey<T>) => void
}

const TableHeader = <T extends { id: string }>({ columnsConfig, sort, enableFilter, inputFilterHandler, sortDataHandler }: TableHeaderProps<T>) => {
    return (
        <thead>
            <HeaderNames columnsConfig={columnsConfig} sort={sort} sortDataHandler={sortDataHandler} />
            {enableFilter && <HeaderInput columnsConfig={columnsConfig} inputFilterHandler={inputFilterHandler} />}
        </thead>
    )
}

interface HeaderNamesProps<T> {
    columnsConfig: ColumnConfigListInterface<T>
    sort: Sort<T> | null
    sortDataHandler: (columnKey: DataKey<T>) => void
}

const HeaderNames = <T extends { id: string }>({ columnsConfig, sort, sortDataHandler }: HeaderNamesProps<T>) => {
    let arrow = ''
    if (sort?.reverse) arrow = "▲"
    else arrow = "▼"
    return (
        <tr className='HeaderName'>
            {columnsConfig.map(columnInfo => <HeaderNameCell
                key={columnInfo.key}
                text={columnInfo.header}
                style={columnInfo.style ? columnInfo.style : {}}
                arrow={sort?.key === columnInfo.key ? arrow : ''}
                sortDataHandler={() => sortDataHandler(columnInfo.key)} />)}
        </tr>
    )
}

interface HeaderNameCellProps {
    text: string
    style: StyleConfig
    arrow: string
    sortDataHandler: () => void
}

const HeaderNameCell = ({ text, style, arrow, sortDataHandler }: HeaderNameCellProps) => {
    return (
        <th style={style} onClick={sortDataHandler}>
            {text} {arrow}
        </th>
    )
}

interface HeaderInputProps<T> {
    columnsConfig: ColumnConfigListInterface<T>
    inputFilterHandler: (dataKey: DataKey<T>, value: string) => void
}

const HeaderInput = <T extends { id: string }>({ columnsConfig, inputFilterHandler }: HeaderInputProps<T>) => {
    return (
        <tr className='HeaderInput'>
            {columnsConfig.map(column => <HeaderInputCell
                type={column.key === 'checkbox' ? 'checkbox' : 'text'}
                key={column.key}
                changeHandler={(newValue) => inputFilterHandler(column.key, newValue)}
                style={column.style ? column.style : {}}
            />)}
        </tr>
    )
}

interface HeaderInputCellProps {
    changeHandler: (value: string) => void
    type: 'checkbox' | 'text'
    style: StyleConfig

}

const HeaderInputCell = ({ changeHandler, type, style }: HeaderInputCellProps) => {
    return (
        <td style={style} >
            <input
                type={type}
                placeholder='Filtruj... '
                onChange={e => changeHandler(type === 'checkbox' ? (e.target.checked ? 'true' : 'false') : e.target.value)}
            />
        </td >
    )
}

export default TableHeader