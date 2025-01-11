import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState, ReactNode } from 'react'
import Loading from '../../components/Loading/Loading.tsx'
import './DevicePage.css'
import BoxModel from '../../components/BoxModel/BoxModel.tsx'
import SelectLocationAssigment from '../../components/SelectLocationAssigment/SelectLocationAssigment.tsx'
import SelectModel from '../../components/SelectModel/SelectModel.tsx'
import BoxLocation from '../../components/BoxLocation/BoxLocation.tsx'
import menuIcon from './../../assets/icons/ellipsis-vertical-solid.svg'
import { DropDownMenu, DropDownMenuButton } from "../../components/DropDownMenu/DropDownMenu.tsx"
import { WindowsTabs, Tab } from '../../components/WindowTabs/WindowsTabs.tsx'
import TableSimple, { DataRow } from '../../components/TableSimple/TableSimple.tsx'
import { useSetAlertBoxContext } from '../../context/AlertContexProvider.tsx'
import BoxSupplierDataTesma from '../../components/BoxSupplierData/BoxSupplierDataTesma.tsx'
import assetServices, { AssetInterface } from '../../services/assetServices.tsx'

const DevicePage = () => {
    const url = useLocation()
    const [assetData, setAssetData] = useState<AssetInterface | null>(null)
    const [windowOnTop, setWindowOnTop] = useState<ReactNode | null>(null)
    const [loading, setLoading] = useState(false)
    const setAlertBox = useSetAlertBoxContext()
    const navigate = useNavigate();

    /** wyświetl okno wyboru lokalizacji */
    const openSelectLocation = () => {
        setWindowOnTop(<SelectLocationAssigment
            getSelected={handleSelectedLocation}
            closeWindow={() => setWindowOnTop(null)}
        />)
    }

    /** obsługa wybrania nowej lokalizacji */
    const handleSelectedLocation = (locationId: string) => {
        if (!assetData) return
        assetServices
            .updateAsset(assetData.id, { assignment_location_ID: locationId }, setAlertBox)
            .then((response) => setAssetData(response))
    }

    /** wyświtl okno wyboru modelu  */
    const openSelectModel = () => {
        setWindowOnTop(<SelectModel
            getSelected={handleSelectModel}
            closeWindow={() => setWindowOnTop(null)}
        />)
    }

    /** obsługa wybrania nowego modelu */
    const handleSelectModel = (modelId: string) => {
        if (!assetData) return
        assetServices
            .updateAsset(assetData.id, { model_ID: modelId }, setAlertBox)
            .then((response) => setAssetData(response))
    }

    /** usuwanie asseu z bazy*/
    const deleteAsset = () => {
        if (!assetData) return
        assetServices
            .deleteAsset(assetData.id, setAlertBox)
            .then(() => navigate(-1))
    }

    useEffect(() => {
        /** pobranie danych assetu wskazanego ID  */
        const loadData = (id: string) => {
            setLoading(true)
            assetServices
                .getAsset(id, setAlertBox)
                .then(response => setAssetData(response))
                .finally(() => setLoading(false))
        }
        loadData(url.state.id)

    }, [url.state.id, setAlertBox])

    return (
        <div className='DevicePage'>
            {windowOnTop && windowOnTop}
            {loading && <Loading />}
            <div className='DeviceSection'>
                <div className='Column'>
                    <h3>Urządzenie:</h3>
                    {assetData &&
                        <TableSimple>
                            <DataRow name='Asset ID' value={assetData.id} />
                            <DataRow name='Numer seryjny' value={assetData.sn} />
                            <DataRow name='Ostatnia inwentaryzacja' value={assetData.last_invent} />
                            <DataRow name='Status' value={assetData.status} />
                            <DataRow name='Koniec leasingu' value={assetData.leasing_end} />
                        </TableSimple>
                    }
                </div>
                <div className='Column'>
                    {assetData?.assignment_location_ID && <BoxLocation locationId={assetData.assignment_location_ID} />}
                </div>
                <div className='Column'>
                    {assetData?.model_ID && <BoxModel modelId={assetData.model_ID} />}
                </div>
                <div className='Column'>
                    <DropDownMenu icon={menuIcon} text='Menu' side='left' >
                        <DropDownMenuButton text={'Zmień model'} buttonHandler={openSelectModel} />
                        <DropDownMenuButton text={'Zmień lokalizację'} buttonHandler={openSelectLocation} />
                        <DropDownMenuButton text={'Usuń'} buttonHandler={deleteAsset} />
                    </DropDownMenu>
                </div>
            </div>
            <WindowsTabs defaultTab={0}>
                <Tab name='Szczegóły'><div></div></Tab>
                {(assetData?.supplier_key === 'tesma' && assetData?.supplier_ID)
                    ? <Tab name='TESMA'>
                        <BoxSupplierDataTesma supplierId={assetData.supplier_ID} />
                    </Tab>
                    : <></>}
            </WindowsTabs>
        </div>
    )
}

export default DevicePage