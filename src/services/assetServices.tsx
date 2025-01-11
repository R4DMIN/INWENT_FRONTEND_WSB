import axios from 'axios';
import { handelErrorAlert } from './serviceHandlers.tsx';
import url from './baseUrl.tsx';
import { SetAlertType } from '../context/AlertContexProvider.tsx';

const baseUrl = `${url}/assetdata`

export interface AssetInterface {
    id: string
    sn: string
    status?: string
    description?: string
    description_extra?: string
    last_invent?: string
    leasing_end?: string
    model_ID?: string
    manufacturer?: string
    model?: string
    device_type?: string
    assignment_location_ID?: string
    business_unit_ID?: string
    business_unit?: string
    location?: string
    location_description?: string
    supplier_key?: string
    supplier_ID?: string
    create_date?: string
    address?: string
}

export interface InventAssetInterface extends AssetInterface {
    newModel?: boolean
}

export interface AssetFilterInterface {
    status?: string
    description?: string
    description_extra?: string
    last_invent?: string
    leasing_end?: string
    model_ID?: string
    assignment_location_ID?: string
    supplier_key?: string
    supplier_ID?: string
    create_date?: string
    business_unit_ID?: string
}

interface AssetToUpdateInteface {
    description?: string
    model_ID?: string
    assignment_location_ID?: string
}

interface AssetInterfaceFindSn {
    data: AssetInterface
    find: 'inwent' | 'supplier' | 'none'
}

export type AssetPossibleColumnType = keyof AssetInterface

const getAsset = async (id: string, setAlert: SetAlertType): Promise<AssetInterface> => {
    const newUrl = `${baseUrl}/${id}`
    const request = axios.get(newUrl)
    return request
        .then(response => response.data)
        .catch(error => handelErrorAlert(error, setAlert))
}

const deleteAsset = async (id: string, setAlert: SetAlertType): Promise<void> => {
    const newUrl = `${baseUrl}/${id}`
    const request = axios.delete(newUrl)
    return request
        .then(response => response.data)
        .catch(error => handelErrorAlert(error, setAlert))
}

const updateAsset = async (id: string, dataToUpadate: AssetToUpdateInteface, setAlert: SetAlertType): Promise<AssetInterface> => {
    const newUrl = `${baseUrl}/${id}`
    const request = axios.put(newUrl, dataToUpadate)
    return request
        .then(response => {
            setAlert(response.data.message)
            return response.data.data
        })
        .catch(error => handelErrorAlert(error, setAlert))
}

const getAssetList = async (setAlert: SetAlertType, columns: AssetPossibleColumnType[], filter?: AssetFilterInterface): Promise<AssetInterface[]> => {
    const newUrl = `${baseUrl}?columns=${columns.toString()}`
    const request = axios.get(newUrl, { params: { filter } })
    return request
        .then(response => response.data)
        .catch(error => handelErrorAlert(error, setAlert))
}

const findBySn = async (setAlert: SetAlertType, sn: string): Promise<AssetInterfaceFindSn> => {
    const newUrl = `${baseUrl}/findSn/${sn}`
    const request = axios.get(newUrl)
    return request
        .then(response => {
            setAlert(response.data.message)
            return response.data
        })
        .catch(error => handelErrorAlert(error, setAlert))
}

const inventAsset = async (setAlert: SetAlertType, asssetData: AssetInterface): Promise<AssetInterface> => {
    const newUrl = `${baseUrl}/invent`
    const request = axios.patch(newUrl, asssetData)
    return request
        .then(response => {
            setAlert(response.data.message)
            return response.data.data
        })
        .catch(error => handelErrorAlert(error, setAlert))
}

const inventAssetList = async (setAlert: SetAlertType, asssetDataList: AssetInterface[]): Promise<AssetInterface[]> => {
    const newUrl = `${baseUrl}/inventlist`
    const request = axios.patch(newUrl, asssetDataList)
    return request
        .then(response => {
            setAlert(response.data.message)
            return response.data.data
        })
        .catch(error => handelErrorAlert(error, setAlert))
}



const assetServices = { getAsset, getAssetList, updateAsset, deleteAsset, findBySn, inventAsset, inventAssetList }
export default assetServices