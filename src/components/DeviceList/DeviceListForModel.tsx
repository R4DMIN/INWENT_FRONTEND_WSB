import { useEffect, useState } from 'react'
import Loading from '../Loading/Loading.tsx'
import Table from '../Table/Table.tsx'
import assetServices, { AssetInterface } from '../../services/assetServices.tsx'
import { useSetAlertBoxContext } from '../../context/AlertContexProvider.tsx'

interface DeviceListForModelProps {
    /** ID modelu dla którego ma wyświetlić listę assetów */
    modelId: string
}

const DeviceListForModel = ({ modelId }: DeviceListForModelProps) => {
    const [data, setData] = useState<AssetInterface[]>([])
    const [loading, setLoading] = useState(false)

    const setAlert = useSetAlertBoxContext()

    useEffect(() => {
        const loadData = () => {
            if (!modelId) return
            setLoading(true)
            assetServices
                .getAssetList(setAlert, ['id', 'sn', 'business_unit', 'location'], { model_ID: modelId })
                .then(response => setData(response))
                .finally(() => setLoading(false))
        }
        loadData()
    }, [modelId, setAlert])

    return <div style={{ padding: 10 }}>
        {loading && <Loading />}
        <Table
            columnConfig={[
                { key: 'id', header: 'ID', link: { to: '/device', returnKeyState: 'id', dataKeyState: 'id' }, style: { maxWidth: 120 } },
                { key: 'sn', header: 'Numer seryjny' },
                { key: 'business_unit', header: 'Jednostka organizacyjna' },
                { key: 'location', header: 'Lokalizacja' },
            ]}
            data={data}
        />
    </div>
}

export default DeviceListForModel