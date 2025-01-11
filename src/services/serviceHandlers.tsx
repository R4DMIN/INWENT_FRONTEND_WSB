import { AxiosError } from 'axios'
import { AlertBoxStateInterface } from '../context/AlertContexProvider';

export interface StatusResponse {
    message: AlertBoxStateInterface
    status: 'success' | 'fail'
}

interface ErrorResponse {
    message: AlertBoxStateInterface | null;
}

export type AxiosErrorInw = AxiosError<ErrorResponse>

export const handelError = (err: AxiosErrorInw) => {
    console.error(err);
    if (err?.response?.data?.message) throw err.response.data.message
}

export const handelErrorAlert = (err: AxiosErrorInw, setAlert: (message: AlertBoxStateInterface) => void) => {
    if (err?.response?.data?.message) setAlert(err.response.data.message)
    if (err?.message === 'Network Error') setAlert({ type: 'Error', text: 'Błąd połączenia z serwerem, spróbuj ponownie później.' })
    throw err
}