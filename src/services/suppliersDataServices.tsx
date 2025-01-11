import axios from 'axios'
import { AxiosErrorInw, handelError, handelErrorAlert } from './serviceHandlers'
import { SetAlertType } from '../context/AlertContexProvider'
import url from './baseUrl.tsx'

const baseUrl = `${url}/suppliersdata`

export interface TesmaAssetData {
    INW_last_update: string,
    INW_outdated: boolean,
    INW_processed: boolean,
    asset_id: number,
    asset_status: string,
    asset_type: string,
    class: string,
    description: string,
    id: string,
    manufacturer: string,
    numer_marketu: string,
    planned_end: string,
    reporting_1: string,
    reporting_2: string,
    schedule_no: number,
    serial_number: string,
    to_number: string,
    end_mlt: string
}

export interface BaseSupplierAssetModel {
    id: string
    model_ID: string
    supplier_key: string
    supplier_model: string
}

export interface SupplierAssetModel extends BaseSupplierAssetModel {
    device_type: string
    manufacturer: string
    model: string
}

const loadTesmaAssetData = async (id: string): Promise<TesmaAssetData> => {
    const newUrl = `${baseUrl}/assetdata/`
    const request = axios.get(newUrl, { params: { supplier: 'tesma', id: id } })
    return request
        .then(response => response.data)
        .catch((err: AxiosErrorInw) => handelError(err))
}

const processModels = async (setAlert: SetAlertType): Promise<void> => {
    const newUrl = `${baseUrl}/processmodels`
    const request = axios.patch(newUrl)
    return request
        .then(response => {
            setAlert(response.data.message)
            return
        })
        .catch((err: AxiosErrorInw) => handelErrorAlert(err, setAlert))
}

const getModels = async (setAlert: SetAlertType, filterBounded: boolean): Promise<SupplierAssetModel[]> => {
    const newUrl = `${baseUrl}/model`
    const request = axios.get(newUrl, { params: { filterBounded: filterBounded } })
    return request
        .then(response => response.data)
        .catch((err: AxiosErrorInw) => handelErrorAlert(err, setAlert))
}

const getBoundedModels = async (setAlert: SetAlertType, modelID: string): Promise<BaseSupplierAssetModel[]> => {
    const newUrl = `${baseUrl}/boundedmodel/${modelID}`
    const request = axios.get(newUrl)
    return request
        .then(response => response.data)
        .catch((err: AxiosErrorInw) => handelErrorAlert(err, setAlert))
}

const boundModels = async (setAlert: SetAlertType, supplierModelID: string, model_ID: string): Promise<void> => {
    const newUrl = `${baseUrl}/model/${supplierModelID}`
    const request = axios.put(newUrl, { model_ID })
    return request
        .then(response => {
            if (response.data.message) setAlert(response.data.message)
            return
        })
        .catch((err: AxiosErrorInw) => handelErrorAlert(err, setAlert))
}

const unboundModels = async (setAlert: SetAlertType, supplierModelID: string): Promise<void> => {
    const newUrl = `${baseUrl}/model/${supplierModelID}`
    const request = axios.put(newUrl, { model_ID: null })
    return request
        .then(response => {
            if (response.data.message) setAlert(response.data.message)
            return
        })
        .catch((err: AxiosErrorInw) => handelErrorAlert(err, setAlert))
}

const suppliersDataServices = { loadTesmaAssetData, processModels, getModels, boundModels, unboundModels, getBoundedModels }
export default suppliersDataServices