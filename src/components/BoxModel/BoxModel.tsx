import './BoxModel.css'
import { useEffect, useState } from 'react'
import Loading from '../Loading/Loading.tsx'
import modelsServices, { BoxModelInterface } from '../../services/modelsServices.tsx'
import TableSimple, { DataRow } from '../TableSimple/TableSimple.tsx'
import { useSetAlertBoxContext } from '../../context/AlertContexProvider.tsx'

interface BoxModelProps {
    /** id modelu do wyświeltenia */
    modelId: string
    /** czy ma się wyświeltlić zdjęcie 
     * domyślnie TRUE
     */
    showPhoto?: boolean
}

const BoxModel = ({ modelId, showPhoto = true }: BoxModelProps) => {
    const [modelData, setModelData] = useState<null | BoxModelInterface>(null)
    const [loading, setLoading] = useState(false)
    const setAlert = useSetAlertBoxContext()

    useEffect(() => {
        modelsServices
            .getModelForBox(setAlert, modelId, showPhoto)
            .then(response => setModelData(response))
            .finally(() => setLoading(false))
    }, [modelId, showPhoto, setAlert])

    return <div className='BoxModel'>
        {loading && <Loading />}
        {showPhoto &&
            <div className="Photo">
                {modelData?.photo && <img src={modelData.photo} alt='Zdjęcie modelu' />}
            </div>
        }
        <TableSimple title={'Model:'}>
            <DataRow name={'Producent'} value={modelData ? modelData.manufacturer : ''} />
            <DataRow name={'Model'} value={modelData ? modelData.model : ''} />
            <DataRow name={'Typ urządzenia'} value={modelData ? modelData.device_type : ''} />
        </TableSimple>
    </div>
}

export default BoxModel