import { useEffect, useState } from 'react'
import Loading from '../Loading/Loading.tsx'
import assetServices, { AssetInterface } from '../../services/assetServices.tsx'
import { useSetAlertBoxContext } from '../../context/AlertContexProvider.tsx'
import Table from '../Table/Table.tsx'

interface DeviceListInLocationProps {
    locationId: string
}

const DeviceListInLocation = ({ locationId }: DeviceListInLocationProps) => {
    const [assetList, setAssetList] = useState<AssetInterface[]>([])
    const [loading, setLoading] = useState(false)

    const setAlert = useSetAlertBoxContext()

    useEffect(() => {
        const loadData = () => {
            if (!locationId) return
            setLoading(true)
            assetServices
                .getAssetList(setAlert, ['id', 'sn', 'manufacturer', 'model'], { assignment_location_ID: locationId })
                .then((response) => setAssetList(response))
                .finally(() => setLoading(false))
        }
        loadData()
    }, [locationId, setAlert])

    return <div className='TablePage'>
        {loading && <Loading />}
        <Table
            columnConfig={[
                { key: 'id', header: 'ID', link: { to: '/device', returnKeyState: 'id', dataKeyState: 'id' }, style: { maxWidth: 120 } },
                { key: 'sn', header: 'Numer Seryjny' },
                { key: 'manufacturer', header: 'Producent' },
                { key: 'model', header: 'Model' }
            ]}
            data={assetList}
        />
    </div>
}

export default DeviceListInLocation