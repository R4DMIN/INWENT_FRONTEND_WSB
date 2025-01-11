import axios from 'axios'
import { AxiosErrorInw, handelErrorAlert } from './serviceHandlers.tsx'
import url from './baseUrl.tsx'
import { SetAlertType } from '../context/AlertContexProvider'
import { UserInterface } from '../context/UserContextProvider.tsx'
import { LoginDBInterface } from './userServices.tsx'

const baseUrl = `${url}/login`

axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('userToken')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        } else {
            delete config.headers.Authorization
        }
        return config
    },
    (error) => Promise.reject(error)
)

const convertUserData = (userDB: LoginDBInterface) => {
    return {
        email: userDB.email,
        firstName: userDB.first_name,
        lastName: userDB.last_name,
        role: userDB.role,
        selectedBusinessUnit: userDB.selected_business_unit ? userDB.selected_business_unit : null
    }
}

const checkAuthToken = (setAlert: SetAlertType, setUser: (user: UserInterface) => void) => {
    const token = localStorage.getItem('userToken')
    if (token) {
        getUser(setAlert, setUser)
    }
}

const login = async (email: string, password: string, setAlert: SetAlertType): Promise<void> => {
    const request = axios.post(baseUrl, { email, password })
    return request
        .then(response => {
            localStorage.setItem('userToken', response.data.token)
            return
        })
        .catch((error: AxiosErrorInw) => {
            localStorage.removeItem('userToken')
            return handelErrorAlert(error, setAlert)
        })
}

const logout = async (setAlert: SetAlertType, clearUser: () => void): Promise<void> => {
    const request = axios.delete(`${baseUrl}`)
    return request
        .then((response) => {
            setAlert(response.data.message)
            localStorage.removeItem('userToken')
            clearUser()
        })
        .catch((error: AxiosErrorInw) => handelErrorAlert(error, setAlert))
}

const getUser = async (setAlert: SetAlertType, setUser: (user: UserInterface) => void): Promise<void> => {
    const request = axios.get(`${baseUrl}/user`)
    return request
        .then((response) => {
            setUser(convertUserData(response.data))
        })
        .catch((error: AxiosErrorInw) => handelErrorAlert(error, setAlert))
}

const loginServices = { login, getUser, checkAuthToken, logout }

export default loginServices