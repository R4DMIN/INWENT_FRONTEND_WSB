import { useEffect, useState } from 'react'
import './Table.css'
import TableHeader from './TableHeader.tsx'
import TableFooter from './TableFooter.tsx'
import TableBody from './TableBody.tsx'
import { ColumnConfigInterface, DataArray, DataKey, Filter, Sort } from './TableIntefaces.tsx'

interface TablePropsBase<T> {
    /** konfiguracja tabeli */
    columnConfig: (ColumnConfigInterface<T>)[]
    /** dane do wyświetlenia */
    data: DataArray<T>
    /** czy włączyć opcje filtrowania danych */
    enableFilter?: boolean
    /** czy włączyć możliwoś sortowania danych */
    enableSort?: boolean
    /** czy stoopka na tkórej można zmieniać strony oraz zmieniać ilość danych na jednej stronie ma być aktywna */
    enableFooter?: boolean
    /** TO DO funkcja która się wykona kiedy ? */
    checkBoxActionHandler?: (idList: string[]) => void

    selectedIds?: string[]
    maxOnPageProps?: number
}

interface TablePropsWithSelect<T> extends TablePropsBase<T> {
    /** funkcja zwaracjąca ID kliknięego na liście elementu */
    selectActionHandler: (id: string | null) => void
    /** ID które jest wybrane w celu onaczenia go w tabeli */
    selectedId: string | null // Wymagane, gdy jest selectActionHandler
}

interface TablePropsWithoutSelect<T> extends TablePropsBase<T> {
    selectActionHandler?: undefined
    selectedId?: undefined
}

type TableProps<T> = TablePropsWithSelect<T> | TablePropsWithoutSelect<T>

const Table = <T extends { id: string }>({
    columnConfig: columnConfigProps,
    data = [],
    enableFilter = false,
    enableSort = false,
    enableFooter = false,
    selectActionHandler = undefined,
    selectedId = null,
    checkBoxActionHandler = undefined,
    selectedIds = [],
    maxOnPageProps = undefined
}: TableProps<T>) => {

    const [activePage, setActivePage] = useState(1)
    const [sort, setSort] = useState<Sort<T> | null>(null)
    const [maxOnPage, setMaxOnPage] = useState(!enableFooter ? 999 : maxOnPageProps ? maxOnPageProps : 100)
    const [columnConfig, setColumnConfig] = useState<ColumnConfigInterface<T>[]>(columnConfigProps)
    const [filter, setFilter] = useState<Filter<T>>({})

    useEffect(() => {
        setColumnConfig(columnConfigProps)
    }, [columnConfigProps])

    useEffect(() => {
        // Jeżeli checkBox jest aktywny, dodaj kolumnę na początku tablicy
        if (checkBoxActionHandler && columnConfig[0].key !== 'checkbox') {
            const checkBoxColumn: ColumnConfigInterface<T>[] = [{
                header: '[ ]',
                key: 'checkbox',
                style: { width: 30 }
            }]
            setColumnConfig([...checkBoxColumn, ...columnConfig])
        }
    }, [checkBoxActionHandler, columnConfig])


    /** obsługa zaznaczenia i odznaczania checboxów  */
    const checkBoxChangeHandler = (id: string) => {
        if (checkBoxActionHandler) {
            let tempList: string[] = []
            // jeżeli ID istnieje to usuń jeżeli nie to dodaj
            if (selectedIds.includes(id))
                tempList = selectedIds.filter(element => element !== id)
            else
                tempList = [...selectedIds, id]

            checkBoxActionHandler(tempList)
        }
    }

    /** obsługa wyboru jednego wiersza i wywołanie przekazanej funkcji */
    const selectHandler = (id: string) => {
        if (selectActionHandler) {
            if (id === selectedId)
                selectActionHandler(null)
            else
                selectActionHandler(id)
        }
    }

    /** zmiana wyświetlanej strony */
    const changePage = (newPage: number) => {
        setActivePage(newPage)
    }

    /** obsługa wpisywania tekstu w pola do filtrowania danych */
    const inputFilterHandler = (dataKey: DataKey<T>, value: string) => {
        setFilter(prevFilter => ({ ...prevFilter, [dataKey]: value }))
    }

    const sortClickHandle = (key: DataKey<T>) => {
        if (enableSort) {
            if (!sort) setSort({ reverse: false, key: key })
            else if (key === sort.key) setSort({ ...sort, reverse: !sort.reverse })
            else setSort({ reverse: false, key: key })
        }
    }

    /** sortowanie danych po kolumnie ustawionej w sort   */
    const sortData = (data: DataArray<T>) => {
        if (sort && enableSort) {
            if (sort.key === 'checkbox')
                return data.sort((a, b) => {
                    const aValue = selectedIds.includes(a.id)
                    const bValue = selectedIds.includes(b.id)
                    if (!sort.reverse) {
                        return aValue < bValue ? 1 : (aValue > bValue ? -1 : 0)
                    } else {
                        return aValue > bValue ? 1 : (aValue < bValue ? -1 : 0)
                    }
                })
            else return data.sort((a: T, b: T) => {
                const aValue = a[sort.key as keyof T]
                const bValue = b[sort.key as keyof T]
                // Porównaj wartości, traktując null/undefined jako ostatnie
                const aComp = aValue ? String(aValue).toLowerCase() : ''
                const bComp = bValue ? String(bValue).toLowerCase() : ''

                if (sort.reverse) {
                    return aComp < bComp ? 1 : (aComp > bComp ? -1 : 0)
                } else {
                    return aComp > bComp ? 1 : (aComp < bComp ? -1 : 0)
                }
            })
        }
        return data
    }

    /** filtruje przekazane dane przez ustawienia w filter */
    const filterData = (filterData: DataArray<T>) => {
        if (enableFilter && columnConfig) {
            columnConfig.forEach(column => {
                // jeżeli w danej kolumniej jest parametr filter i nie jest on pusty 
                if (filter[column.key] && filter[column.key] !== '') {
                    // jeżeli to kolumna z checbox to 
                    if (column.key === 'checkbox') {
                        if (filter[column.key] === 'true') {
                            filterData = filterData.filter((dataRow) => selectedIds.includes(dataRow.id))
                        }
                    } else {
                        filterData = filterData.filter((dataRow) => {
                            const value = dataRow[column.key as keyof T]
                            if (!value || typeof value !== 'string') return false
                            return value
                                .toLowerCase()
                                .includes(filter[column.key]!.toLowerCase())
                        })
                    }
                }
            })
        }
        return filterData
    }

    const dataToShow = (sortData(filterData(data)))

    return (
        <div className='Table'>
            <table >
                <TableHeader
                    columnsConfig={columnConfig}
                    sort={sort}
                    inputFilterHandler={(dataKey, value) => inputFilterHandler(dataKey, value)}
                    sortDataHandler={(e) => sortClickHandle(e)}
                    enableFilter={enableFilter}
                />
                <TableBody
                    data={dataToShow.slice((activePage - 1) * maxOnPage, (activePage) * maxOnPage)}
                    columnsConfig={columnConfig}
                    checkBoxChangeHandler={checkBoxChangeHandler}
                    selectHandler={selectHandler}
                    selectedId={selectedId}
                    checBoxSelected={selectedIds}
                />
            </table>
            {enableFooter &&
                <TableFooter
                    numberOfPages={dataToShow.length / maxOnPage}
                    activePage={activePage}
                    changePageHandler={(newPage => changePage(newPage))}
                    maxOnPage={maxOnPage}
                    changeMaxOnPage={(max) => setMaxOnPage(max)}
                />}
        </div>
    )
}

export default Table