import axios from 'axios'
import { AxiosErrorInw, handelErrorAlert } from './serviceHandlers.tsx'
import url from './baseUrl.tsx'
import { SetAlertType } from '../context/AlertContexProvider.tsx'
import { BusinessUnitBaseInteface } from './businessUnitsServices.tsx'

const baseUrl = `${url}/users`

export interface DBUserInterface {
    id: string
    email: string
    first_name: string
    last_name: string
    role: 'user' | 'admin' | 'powerUser'
}

export interface LoginDBInterface extends DBUserInterface {
    selected_business_unit?: BusinessUnitBaseInteface
}

export interface NewDBUserInterface extends DBUserInterface {
    password: string
    password2: string
}

const getUsers = async (setAlert: SetAlertType): Promise<DBUserInterface[]> => {
    const request = axios.get(baseUrl)
    return request
        .then(response => response.data)
        .catch((error: AxiosErrorInw) => handelErrorAlert(error, setAlert))
}

const createUser = async (setAlert: SetAlertType, newUser: NewDBUserInterface): Promise<void> => {
    const request = axios.post(baseUrl, newUser)
    return request
        .then(response => {
            setAlert(response.data.message)
            return
        })
        .catch((error: AxiosErrorInw) => handelErrorAlert(error, setAlert))
}

const updateUser = async (setAlert: SetAlertType, id: string, user: DBUserInterface): Promise<void> => {
    const request = axios.put(`${baseUrl}/update/${id}`, user)
    return request
        .then(response => {
            setAlert(response.data.message)
            return
        })
        .catch((error: AxiosErrorInw) => handelErrorAlert(error, setAlert))
}

const ressetPassword = async (setAlert: SetAlertType, id: string, password: string): Promise<void> => {
    const request = axios.put(`${baseUrl}/resetpassword/${id}`, { password: password })
    return request
        .then(response => {
            setAlert(response.data.message)
            return
        })
        .catch((error: AxiosErrorInw) => handelErrorAlert(error, setAlert))
}

const deleteUser = async (setAlert: SetAlertType, id: string): Promise<void> => {
    const request = axios.delete(baseUrl, { data: { id: id } })
    return request
        .then(response => {
            setAlert(response.data.message)
        })
        .catch((error: AxiosErrorInw) => handelErrorAlert(error, setAlert))
}

const saveUserBusinessUnits = async (setAlert: SetAlertType, userID: string, businessUnitsIDs: string[]): Promise<void> => {
    const request = axios.post(`${baseUrl}/businessUnits/${userID}`, businessUnitsIDs)
    return request
        .then(response => {
            setAlert(response.data.message)
            return
        })
        .catch((error: AxiosErrorInw) => handelErrorAlert(error, setAlert))
}

const getUserBusinessUnitsIDs = async (setAlert: SetAlertType, userID: string): Promise<string[]> => {
    const request = axios.get(`${baseUrl}/businessUnitIDs/${userID}`)
    return request
        .then(response => response.data)
        .catch((error: AxiosErrorInw) => handelErrorAlert(error, setAlert))
}

const getUserBusinessUnits = async (setAlert: SetAlertType): Promise<BusinessUnitBaseInteface[]> => {
    const request = axios.get(`${baseUrl}/businessUnits`)
    return request
        .then(response => response.data)
        .catch((error: AxiosErrorInw) => handelErrorAlert(error, setAlert))
}

const saveActiveBusinessUnit = async (setAlert: SetAlertType, businessUnitID: string): Promise<void> => {
    const request = axios.put(`${baseUrl}/saveActiveBusinessUnit/${businessUnitID}`)
    return request
        .then(() => { return })
        .catch((error: AxiosErrorInw) => handelErrorAlert(error, setAlert))
}

const userServices = { getUsers, createUser, deleteUser, updateUser, ressetPassword, saveUserBusinessUnits, getUserBusinessUnitsIDs, getUserBusinessUnits, saveActiveBusinessUnit }

export default userServices