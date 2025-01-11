import axios from 'axios';
import { handelErrorAlert } from './serviceHandlers.tsx';
import { SetAlertType } from '../context/AlertContexProvider.tsx';
import url from './baseUrl.tsx';

const baseUrl = `${url}/locationdata`

export interface LocationBaseInterface {
    id: string
    business_unit: string
    location: string
    location_description: string
    stock: boolean
}

export interface LocationDetailsInterface extends LocationBaseInterface {
    assetCount: string
}

export interface LocationToAddInterface {
    business_unit_ID: string
    location: string
    location_description?: string
    stock: boolean
}

export interface LocationToUpdateInterface {
    location?: string
    location_description?: string
}

const getLocationBase = async (setAlert: SetAlertType, id: string): Promise<LocationBaseInterface> => {
    const columns = ['business_unit', 'location', 'location_description']
    const newUrl = `${baseUrl}/${id}?columns=${columns.toString()}`
    const request = axios.get(newUrl)
    return request
        .then(response => response.data)
        .catch(error => handelErrorAlert(error, setAlert))
}

const getLocationDetails = async (setAlert: SetAlertType, id: string): Promise<LocationDetailsInterface> => {
    const newUrl = `${baseUrl}/${id}`
    const request = axios.get(newUrl)
    return request
        .then(response => response.data)
        .catch(error => handelErrorAlert(error, setAlert))
}

const getLocationForBox = async (setAlert: SetAlertType, id: string): Promise<LocationBaseInterface> => {
    const columns = ['business_unit', 'location', 'location_description']
    const newUrl = `${baseUrl}/${id}?columns=${columns.toString()}`
    const request = axios.get(newUrl)
    return request
        .then(response => response.data)
        .catch(error => handelErrorAlert(error, setAlert))
}

const getAllLocationInBusinessUnit = async (setAlert: SetAlertType, businessUnitId: string): Promise<LocationBaseInterface[]> => {
    const newUrl = `${baseUrl}?business_unit_ID=${businessUnitId}`
    const request = axios.get(newUrl)
    return request
        .then(response => response.data)
        .catch(error => handelErrorAlert(error, setAlert))
}

const addNew = async (setAlert: SetAlertType, data: LocationToAddInterface): Promise<string> => {
    const request = axios.post(baseUrl, data)
    return request
        .then(response => {
            setAlert(response.data.message)
            return response.data.data
        })
        .catch(error => handelErrorAlert(error, setAlert))
}

const deleteById = async (setAlert: SetAlertType, id: string): Promise<string> => {
    const newUrl = `${baseUrl}/${id}`
    const request = axios.delete(newUrl)
    return request
        .then(response => {
            setAlert(response.data.message)
            return response.data.data
        })
        .catch(error => handelErrorAlert(error, setAlert))
}

const updateById = async (setAlert: SetAlertType, id: string, data: LocationToUpdateInterface): Promise<string> => {
    const newUrl = `${baseUrl}/${id}`
    const request = axios.put(newUrl, data)
    return request
        .then(response => {
            setAlert(response.data.message)
            return response.data.data
        })
        .catch(error => handelErrorAlert(error, setAlert))
}

const locationServices = { getLocationBase, getLocationDetails, getLocationForBox, getAllLocationInBusinessUnit, addNew, deleteById, updateById }
export default locationServices