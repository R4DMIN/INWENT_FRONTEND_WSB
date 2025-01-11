import { StyleConfig } from '../../interfaces'

export type ColumnConfigListInterface<TData> = ColumnConfigInterface<TData>[]

export type DataKey<TData> = Extract<keyof TData, string> | 'checkbox'
type OnlyDataKey<TData> = keyof TData

export interface ColumnConfigInterface<TData> {
    /** klucz  */
    key: DataKey<TData>
    /** nagłówek kolumny */
    header: string
    /** opcjonalnie link */
    link?: LinkConfigInterface<TData>
    /** opcjonalnie przycisk */
    button?: ButtonConfigInterface
    /** styl */
    style?: StyleConfig
    /** jest typu boolean */
    boolean?: boolean
}

interface LinkConfigInterface<TData> {
    /** do czego prowadzi link */
    to: string
    /** klucz pod jakim jest zwracana wartoś w linku  */
    returnKeyState: string
    /** state przekazany z linkiem podany z ręcznie */
    state?: string
    /** state z warości wskazanego klucza w danych */
    dataKeyState?: OnlyDataKey<TData>
}

interface ButtonConfigInterface {
    text: string
    onClick: () => void
    icon?: HTMLImageElement | string | File
}

export interface Sort<TData> {
    key: DataKey<TData>
    reverse: boolean
}

export type DataArray<TData> = TData[]

export type Filter<T> = Partial<Record<DataKey<T> | 'checkbox', string>>