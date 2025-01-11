import Table from '../Table/Table.tsx'
import { useCallback, useEffect, useState } from 'react'
import modelsServices, { ModelBaseInterface } from '../../services/modelsServices.tsx'
import locationService, { LocationBaseInterface } from '../../services/locationServices.tsx'
import { useSetAlertBoxContext } from '../../context/AlertContexProvider.tsx'
import { AssetInterface } from '../../services/assetServices.tsx'

interface InventScanListProps {
    /** lista zeskanowanych assetów */
    list: AssetInterface[]
    /** obsługa wybrania konkretnego assetu */
    handleSelect: (id: string | null) => void
    /** id wybranego assetu */
    selectedAssetId: string | null
}

interface ModelList {
    [key: string]: ModelBaseInterface
}

interface LocationList {
    [key: string]: LocationBaseInterface
}

const InventScanList = ({ list, handleSelect, selectedAssetId }: InventScanListProps) => {
    const [locationData, setLocationData] = useState<LocationList>({})
    const [modelData, setModelData] = useState<ModelList>({})
    const setAlertBox = useSetAlertBoxContext()

    /** dodaje do każdego objektu w liście dodatkowe klucze na podstawie model_ID oraz assignment_location_ID */
    const processData = useCallback(() => list.map(assetObject => ({
        ...assetObject,
        model: (assetObject.model_ID && modelData[assetObject.model_ID]) ? modelData[assetObject.model_ID].model : '',
        manufacturer: (assetObject.model_ID && modelData[assetObject.model_ID]) ? modelData[assetObject.model_ID].manufacturer : '',
        device_type: (assetObject.model_ID && modelData[assetObject.model_ID]) ? modelData[assetObject.model_ID].device_type : '',
        location: (assetObject.assignment_location_ID && locationData[assetObject.assignment_location_ID]) ? locationData[assetObject.assignment_location_ID].location : '',
        business_unit: (assetObject.assignment_location_ID && locationData[assetObject.assignment_location_ID]) ? locationData[assetObject.assignment_location_ID].business_unit : ''

    }))
        , [list, modelData, locationData])

    useEffect(() => {

        const fetchData = async () => {
            const modelPromises: Promise<ModelBaseInterface>[] = []
            const locationPromises: Promise<LocationBaseInterface>[] = []

            //zbór przechowywujące aktywne zapytania 
            const modelIDsInProgress: Set<string> = new Set()
            const locationIDsInProgress: Set<string> = new Set()

            list.forEach(asset => {
                if (asset.model_ID && !modelData[asset.model_ID] && !modelIDsInProgress.has(asset.model_ID)) {
                    modelIDsInProgress.add(asset.model_ID)
                    modelPromises.push(
                        modelsServices
                            .getModelBase(asset.model_ID)
                            .then((response) => setModelData(prevModelData => ({ ...prevModelData, [response.id]: response })))
                            .catch(message => message && setAlertBox(message))
                    )
                }
                if (asset.assignment_location_ID && !locationData[asset.assignment_location_ID] && !locationIDsInProgress.has(asset.assignment_location_ID)) {
                    locationIDsInProgress.add(asset.assignment_location_ID)
                    locationPromises.push(
                        locationService
                            .getLocationBase(setAlertBox, asset.assignment_location_ID)
                            .then((response) => setLocationData(prevLocationData => ({ ...prevLocationData, [response.id]: response })))
                            .catch(message => message && setAlertBox(message))
                    )
                }
            })

            await Promise.all([...modelPromises, ...locationPromises])
        }

        fetchData()
    }, [list, modelData, locationData, setAlertBox])

    return <Table
        columnConfig={[
            { key: 'sn', header: 'Numer Seryjny' },
            { key: 'last_invent', header: 'Ostatnia inwentaryzacja' },
            { key: 'business_unit', header: 'Jednostka Organizacyjna' },
            { key: 'location', header: 'Lokalizacja' },
            { key: 'device_type', header: 'Typ Urządzenia' },
            { key: 'manufacturer', header: 'Producent' },
            { key: 'model', header: 'Model' },
            { key: 'description', header: 'Opis', style: { maxWidth: '100px' } }]}
        data={processData()}
        enableSort={true}
        selectActionHandler={handleSelect}
        selectedId={selectedAssetId}
    />

}

export default InventScanList