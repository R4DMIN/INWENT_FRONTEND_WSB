import axios from 'axios'
import { AxiosErrorInw, handelError, handelErrorAlert } from './serviceHandlers.tsx'
import { SetAlertType } from '../context/AlertContexProvider.tsx'
import url from './baseUrl.tsx'
const baseUrl = `${url}/models`

export interface ModelBaseInterface {
    id: string
    device_type: string
    manufacturer: string
    model: string
}

export interface BoxModelInterface extends ModelBaseInterface {
    photo?: string
}

export interface ModelDetailsInterface extends ModelBaseInterface {
    model_description: string
    photo?: string
    asset_count?: string
}

export interface ModelToUpdateInterface {
    model_description?: string
    photo?: string
}

export interface ModelToAddInterface {
    device_type: string
    manufacturer: string
    model: string
    model_description?: string
    photo?: string
}

const getModelList = async (setAlert: SetAlertType): Promise<ModelBaseInterface[]> => {
    const request = axios.get(baseUrl)
    return request
        .then(response => response.data)
        .catch((err: AxiosErrorInw) => handelErrorAlert(err, setAlert))
}

const getModelBase = async (id: string): Promise<ModelBaseInterface> => {
    const newUrl = `${baseUrl}/columns/${id}`
    const request = axios.get(newUrl, { params: { manufacturer: 1, model: 1, device_type: 1 } })
    return request
        .then(response => response.data)
        .catch((err: AxiosErrorInw) => handelError(err))
}

const getModelForBox = async (setAlert: SetAlertType, id: string, photo: boolean): Promise<BoxModelInterface> => {
    const newUrl = `${baseUrl}/box/${id}/?photo=${photo ? 1 : 0}`
    const request = axios.get(newUrl)
    return request
        .then(response => response.data)
        .catch((err: AxiosErrorInw) => handelErrorAlert(err, setAlert))
}

const getModelDetails = async (id: string, setAlert: SetAlertType): Promise<ModelDetailsInterface> => {
    const newUrl = `${baseUrl}/${id}`
    const request = axios.get(newUrl)
    return request
        .then(response => response.data)
        .catch((err: AxiosErrorInw) => handelErrorAlert(err, setAlert))
}

const updateById = async (id: string, data: ModelToUpdateInterface, setAlert: SetAlertType): Promise<void> => {
    const newUrl = `${baseUrl}/${id}`
    const request = axios.put(newUrl, data)
    return request
        .then(response => {
            setAlert(response.data.message)
            return
        })
        .catch((err: AxiosErrorInw) => handelErrorAlert(err, setAlert))
}

const deleteById = async (setAlert: SetAlertType, id: string): Promise<void> => {
    const newUrl = `${baseUrl}/${id}`
    const request = axios.delete(newUrl)
    return request
        .then(response => setAlert(response.data.message))
        .catch((err: AxiosErrorInw) => handelErrorAlert(err, setAlert))
}

const addNew = async (data: ModelToAddInterface, setAlert: SetAlertType): Promise<string> => {
    const request = axios.post(baseUrl, data)
    return request
        .then(response => {
            setAlert(response.data.message)
            return response.data.data
        })
        .catch((err: AxiosErrorInw) => handelErrorAlert(err, setAlert))
}

const getManufacturerList = async (): Promise<string[]> => {
    const newUrl = `${baseUrl}/manufacturer/list`
    const request = axios.get(newUrl)
    return request
        .then(response => response.data)
        .catch((err: AxiosErrorInw) => handelError(err))
}

const modelsServices = { getModelList, getModelBase, getModelForBox, getModelDetails, deleteById, addNew, updateById, getManufacturerList }
export default modelsServices