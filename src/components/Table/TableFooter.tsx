import { ReactNode } from 'react'

interface TableFooterProps {
    /** liczba stron */
    numberOfPages: number
    /** aktywna storna */
    activePage: number
    /** handler do zmiany strony który jako argument przyjmuje nową stronę */
    changePageHandler: (pageNumber: number) => void
    /** aktualna maksymalna ilość elementów na stronie */
    maxOnPage: number
    /** handler do zmiany maksymalnej ilości elementów na stornie przyjmujący nowa liczbę */
    changeMaxOnPage: (max: number) => void
}

const TableFooter = ({ numberOfPages, activePage, changePageHandler, maxOnPage, changeMaxOnPage }: TableFooterProps) => {
    numberOfPages = Math.ceil(numberOfPages)
    const buttons: ReactNode[] = []
    const nextPage = activePage + 1 > numberOfPages ? numberOfPages : activePage + 1
    const previousPage = activePage - 1 < 1 ? 1 : activePage - 1

    for (let i = 1; i <= numberOfPages; i++) {
        const text = i === activePage ? '[' + i + ']' : i
        buttons.push(<button className='NumberButton' key={i} onClick={() => changePageHandler(i)}>{text}</button>)
    }

    return (
        <div className='TableFooter'>
            <div>
                Strona {activePage} z {numberOfPages}
                <button className='ArrowButton' onClick={() => changePageHandler(previousPage)}>{'<'}</button>
                {buttons}
                <button className='ArrowButton' onClick={() => changePageHandler(nextPage)}>{'>'}</button>
            </div>
            <select defaultValue={maxOnPage} onChange={(e) => changeMaxOnPage(Number(e.target.value))}>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
            </select>
        </div>
    )
}

export default TableFooter