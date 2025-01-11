import { useEffect, useState } from 'react'
import suppliersDataServices, { TesmaAssetData } from '../../services/suppliersDataServices.tsx'
import Loading from '../Loading/Loading.tsx'
import './BoxSupplierData.css'
import TableSimple, { DataRow } from '../TableSimple/TableSimple.tsx'
import { useSetAlertBoxContext } from '../../context/AlertContexProvider.tsx'

interface BoxSupplierDataTesmaProps {
    /** ID assetu w bazie danych tesma */
    supplierId: string
}

const BoxSupplierDataTesma = ({ supplierId }: BoxSupplierDataTesmaProps) => {
    const [supplierData, setSupplierData] = useState<null | TesmaAssetData>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const setAlert = useSetAlertBoxContext()

    useEffect(() => {
        const loadAssetData = (supplierId: string) => {
            setLoading(true)
            suppliersDataServices
                .loadTesmaAssetData(supplierId)
                .then(response => setSupplierData(response))
                .catch(error => error && setAlert(error))
                .finally(() => setLoading(false))
        }
        loadAssetData(supplierId)
    }, [supplierId, setAlert])

    return <div className='BoxSupplierData'>
        {loading && <Loading />}
        {supplierData && <>
            <TableSimple type='Color'>
                <DataRow name='Asset ID' value={supplierData.asset_id} />
                <DataRow name='Numer Seryjny' value={supplierData.serial_number} />
                <DataRow name='Asset status' value={supplierData.asset_status} />
                <DataRow name='Numer Sklepu' value={supplierData.numer_marketu} />
                <DataRow name='Leasing end' value={supplierData.planned_end} />
                <DataRow name='END MLT' value={supplierData.end_mlt} />
            </TableSimple>
            <TableSimple type='Color'>
                <DataRow name='Producent' value={supplierData.manufacturer} />
                <DataRow name='Opis' value={supplierData.description} />
                <DataRow name='Rep 1' value={supplierData.reporting_1} />
                <DataRow name='Rep 2' value={supplierData.reporting_2} />
            </TableSimple>
            <TableSimple type='Color'>
                <DataRow name='Klasa urządzenia' value={supplierData.class} />
                <DataRow name='Typ assetu' value={supplierData.asset_type} />
                <DataRow name='Numer zamówienia' value={supplierData.to_number} />
                <DataRow name='Schedule No.' value={supplierData.schedule_no} />
            </TableSimple>
            <TableSimple type='Color'>
                <DataRow name='DANE INWENT' value='' />
                <DataRow name='ID' value={supplierData.id} />
                <DataRow name='Ostatnia aktualizacja' value={supplierData.INW_last_update} />
                <DataRow name='Usunięty z bazy TESMA' value={supplierData.INW_outdated ? 'TAK' : 'NIE'} />
            </TableSimple>
        </>
        }
    </div>
}

export default BoxSupplierDataTesma