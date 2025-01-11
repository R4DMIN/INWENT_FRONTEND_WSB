import axios from 'axios'
import { StatusResponse } from './serviceHandlers'
import url from './baseUrl'

const baseUrl = `${url}/file/upload'`

const tesmaCsvUpload = async (file: File): Promise<StatusResponse> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('supplier', 'tesma')

    const newUrl = baseUrl + '/suppliers/csv'
    const request = axios.post(newUrl, formData)
    return request.then(response => response.data)
}


const toolsService = { tesmaCsvUpload }
export default toolsService