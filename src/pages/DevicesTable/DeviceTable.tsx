import Table from '../../components/Table/Table.tsx'
import assetServices, { AssetFilterInterface, AssetInterface } from '../../services/assetServices.tsx'
import Loading from '../../components/Loading/Loading.tsx'
import { ReactNode, useEffect, useState } from 'react'
import './DeviceTable.css'
import { useSetAlertBoxContext } from '../../context/AlertContexProvider.tsx'
import { useUserContextRead } from '../../context/UserContextProvider.tsx'
import Button from '../../components/Button/Button.tsx'
import { ColumnConfigInterface, DataKey } from '../../components/Table/TableIntefaces.tsx'
import SelectColumns from '../../components/SelectColumns/SelectColumns.tsx'

const possibleColumnList: ColumnConfigInterface<AssetInterface>[] = [
    {
        key: 'id', header: 'ID', link: { to: '/device', dataKeyState: 'id', returnKeyState: 'id' },
        style: { maxWidth: '60px', width: '60px' }
    },
    { key: 'sn', header: 'Numer Seryjny' },
    { key: 'status', header: 'Status' },
    { key: 'description', header: 'Opis' },
    { key: 'description_extra', header: 'Opis dodatkowy' },
    { key: 'last_invent', header: 'Ostatnia inwentaryzacja' },
    { key: 'leasing_end', header: 'Koniec leasingu' },
    { key: 'model_ID', header: 'ID modelu' },
    { key: 'manufacturer', header: 'Producent' },
    { key: 'model', header: 'Model' },
    { key: 'device_type', header: 'Typ urządzenia' },
    { key: 'assignment_location_ID', header: 'ID lokalizacji' },
    { key: 'business_unit_ID', header: 'ID jednoski organizacyjnej' },
    { key: 'business_unit', header: 'Jednostka organizacyjna' },
    { key: 'location', header: 'Lokalizacja' },
    { key: 'location_description', header: 'Opis lokalizacji' },
    { key: 'supplier_key', header: 'Dostawca' },
    { key: 'supplier_ID', header: 'ID dostawcy' },
    { key: 'create_date', header: 'Data utworzenia' },
    { key: 'address', header: 'Adres' }
]

const DevicesTable = () => {
    const [assetList, setAssetList] = useState<AssetInterface[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedIDs, setSeletedIDs] = useState<string[]>([])
    const [showAll, setShowAll] = useState(false)
    const [selectedKeys, setSelectedKeys] = useState<DataKey<AssetInterface>[]>(['id', 'status', 'sn', 'last_invent', 'device_type', 'manufacturer', 'model', 'business_unit', 'location', 'leasing_end'])
    const [windowOnTop, setWindowOnTop] = useState<ReactNode | null>(null)

    const user = useUserContextRead()
    const setAlert = useSetAlertBoxContext()

    useEffect(() => {
        let fetchFilter: AssetFilterInterface = {}

        if (user?.selectedBusinessUnit && !showAll) fetchFilter = { business_unit_ID: user.selectedBusinessUnit.id }
        // pobieranie danych urządzeń z serwera
        const loadDevicesData = () => {
            setLoading(true)
            assetServices
                .getAssetList(setAlert, selectedKeys.filter(e => e !== 'checkbox'), fetchFilter)
                .then(response => setAssetList(response))
                .catch(message => message && setAlert(message))
                .finally(() => setLoading(false))
        }
        loadDevicesData()
    }, [setAlert, user, showAll, selectedKeys])

    const getSelected = () => {
        console.log(selectedIDs);
    }

    const openSelectColumnWindow = () => {
        setWindowOnTop(<SelectColumns closeWindow={() => setWindowOnTop(null)} setSelected={setSelectedKeys} selected={selectedKeys} possibleColumnConfig={possibleColumnList} />)
    }

    return (
        <div style={{ width: '100%', display: 'flex', maxHeight: '100%' }}>
            {windowOnTop && windowOnTop}
            <div className='TablePage'>
                <div className='TablePageButtonLeftRightSection'>
                    <div className='TablePageButtonSection'>
                        <Button name={showAll ? `Pokaż ${user?.selectedBusinessUnit?.short_name}` : 'Pokaż wszystkie'} buttonHandler={() => setShowAll(prev => !prev)} />
                        <Button name='Przypisz lokalizację (TODO)' buttonHandler={getSelected} disabled={selectedIDs.length === 0} />
                        <Button name='Przypisz model (TODO)' buttonHandler={getSelected} disabled={selectedIDs.length === 0} />
                    </div>
                    <div className='TablePageButtonSection'>
                        <Button name='Wybierz kolumny' buttonHandler={openSelectColumnWindow} />
                    </div>
                </div>
                {loading && <Loading />}
                <Table
                    columnConfig={selectedKeys
                        .map(key => possibleColumnList
                            .find(e => e.key === key))
                        .filter(e => e !== undefined)}
                    data={assetList}
                    enableFilter={true}
                    enableSort={true}
                    checkBoxActionHandler={setSeletedIDs}
                    selectedIds={selectedIDs}
                    enableFooter={true}
                />
            </div>
        </div>
    )
}

export default DevicesTable