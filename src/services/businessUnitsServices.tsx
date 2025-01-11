import axios from 'axios'
import { AxiosErrorInw, handelErrorAlert } from './serviceHandlers'
import { AlertBoxStateInterface, SetAlertType } from '../context/AlertContexProvider'
import url from './baseUrl'

const baseUrl = `${url}/businessUnit`

export interface BusinessUnitBaseInteface {
    id: string
    short_name: string
}

export interface BusinessUnitInteface extends BusinessUnitBaseInteface {
    full_name: string
    city: string
    zip_code: string
    address: string
    street: string
}

export interface EditBussinesUnitInterface {
    id?: string
    full_name: string
    short_name: string
    city: string
    zip_code: string
    street: string
}

const addNew = async (newBussinesUnit: EditBussinesUnitInterface, setAlert: SetAlertType): Promise<void> => {
    const request = axios.post(baseUrl, newBussinesUnit)
    return request
        .then((response) => {
            setAlert(response.data.message)
        })
        .catch((err: AxiosErrorInw) => handelErrorAlert(err, setAlert))
}

const update = async (id: string, businessUnit: EditBussinesUnitInterface, setAlert: SetAlertType): Promise<void> => {
    const url = `${baseUrl}/${id}`
    const request = axios.put(url, businessUnit)
    return request
        .then((response) => {
            setAlert(response.data.message)
        })
        .catch((err: AxiosErrorInw) => handelErrorAlert(err, setAlert))
}

const getList = async (setAlert: (message: AlertBoxStateInterface) => void): Promise<BusinessUnitInteface[]> => {
    const request = axios.get(baseUrl)
    return request
        .then((response) => {
            return response.data
        })
        .catch((err: AxiosErrorInw) => handelErrorAlert(err, setAlert))
}

const deleteById = async (id: string, setAlert: (message: AlertBoxStateInterface) => void): Promise<void> => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request
        .then((response) => {
            setAlert(response.data.message)
        })
        .catch((err: AxiosErrorInw) => handelErrorAlert(err, setAlert))
}

const businessUnitsServices = { addNew, getList, deleteById, update }
export default businessUnitsServices