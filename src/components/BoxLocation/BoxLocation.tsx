import { useEffect, useState } from 'react'
import './BoxLocation.css'
import Loading from '../Loading/Loading.tsx'
import locationServices, { LocationBaseInterface } from '../../services/locationServices.tsx'
import TableSimple, { DataRow } from '../TableSimple/TableSimple.tsx'
import { useSetAlertBoxContext } from '../../context/AlertContexProvider.tsx'

interface BoxLocationProps {
    locationId: string
}

const BoxLocation = ({ locationId }: BoxLocationProps) => {

    const [locationData, setLocationData] = useState<LocationBaseInterface | null>(null)
    const [loading, setLoading] = useState(false)
    const setAlert = useSetAlertBoxContext()

    useEffect(() => {
        setLoading(true)
        locationServices
            .getLocationForBox(setAlert, locationId)
            .then(response => setLocationData(response))
            .finally(() => setLoading(false))

    }, [locationId, setAlert])

    return <div className='BoxLocation'>
        {loading && <Loading />}
        <TableSimple title='Lokalizacja:'>
            <DataRow name={'Jednostka organizacyjna'} value={locationData ? locationData.business_unit : ''} />
            <DataRow name={'Lokalizacja'} value={locationData ? locationData.location : ''} />
            <DataRow name={'Opis'} value={locationData ? locationData.location_description : ''} />
        </TableSimple>
    </div>
}

export default BoxLocation