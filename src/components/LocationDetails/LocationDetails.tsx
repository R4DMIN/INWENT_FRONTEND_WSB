import './LocationDetails.css'
import { useEffect, useState, KeyboardEvent, useCallback } from 'react'
import locationService, { LocationDetailsInterface, LocationToAddInterface } from '../../services/locationServices.tsx'
import Loading from '../Loading/Loading.tsx'
import Button from '../Button/Button.tsx'
import { useUserContextSelectedBusinessUnit } from '../../context/UserContextProvider.tsx'
import { useSetAlertBoxContext } from '../../context/AlertContexProvider.tsx'
import TableSimple, { DataRow, InputRow, SelectElementRow } from '../TableSimple/TableSimple.tsx'
import React from 'react'
import Collapsible from '../Collapsible/Collapsible.tsx'
import DeviceListInLocation from '../DeviceList/DeviceListInLocation.tsx'

// Definiowanie typów dla propsów
interface LocationDetailsProps {
    locationId: string | null
    reloadDataAndSetSelect: (id: string | null) => void
    activeEdit: boolean
    cancelEdit: () => void
}

const LocationDetails: React.FC<LocationDetailsProps> = ({ locationId, reloadDataAndSetSelect, activeEdit, cancelEdit }) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [locationData, setLocationData] = useState<LocationDetailsInterface | null>(null)
    const userBusinessUnit = useUserContextSelectedBusinessUnit()
    const setAlertBox = useSetAlertBoxContext()

    /** osbługa skrótów klawiszowych */
    const keyboardShortcuts = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') saveLocationData()
    }

    /** inicjacja danych dla nowej lokalizacji */
    const initNewLocation = () => {
        if (!userBusinessUnit) return
        setLocationData({
            business_unit: userBusinessUnit.short_name,
            location: '',
            location_description: '',
            id: '',
            assetCount: '',
            stock: false
        })
    }

    /** Osbługa danych wejściowcych */
    const inputHandler = (key: string, newValue: string) => {
        if (!locationData) return
        if (key === 'stock') {
            setLocationData({ ...locationData, stock: newValue === 'tak' ? true : false })
        }
        else
            setLocationData({ ...locationData, [key]: newValue })

    }

    /** Załaduj dane lokalizacji */
    const loadLocationData = useCallback((id: string) => {
        setLoading(true)
        locationService
            .getLocationDetails(setAlertBox, id)
            .then((result) => setLocationData(result))
            .finally(() => setLoading(false))
    }, [setAlertBox])

    /** obsługa przycisku zapisz  */
    const saveLocationData = () => {
        if (locationId && locationData)
            locationService
                .updateById(setAlertBox, locationId, locationData)
                .then((response) => {
                    reloadDataAndSetSelect(response)
                    cancelEdit()
                })

        else if (!locationData?.location)
            setAlertBox({
                type: 'Warning',
                text: `Nie wprowadzono "Lokalizacja", uzupełnie i spróbuj ponownie.`
            })
        else {
            if (!userBusinessUnit) return
            const newLocation: LocationToAddInterface = {
                business_unit_ID: userBusinessUnit.id,
                location: locationData.location,
                location_description: locationData.location_description,
                stock: locationData.stock ? locationData.stock : false
            }
            locationService
                .addNew(setAlertBox, newLocation)
                .then((response) => reloadDataAndSetSelect(response))
        }
    }


    useEffect(() => {
        if (!locationId || locationId === '') initNewLocation()
        else loadLocationData(locationId)
    }, [locationId, loadLocationData])

    return (
        <div className='LocationDetails' onKeyDown={(e) => keyboardShortcuts(e)}>
            {loading && <Loading />}
            <div className='TEST'>
                <div className='Data'>
                    <TableSimple title='Szczegóły lokalizacji:'>
                        <DataRow name={'Jednostka organizacyjna'} value={locationData ? locationData['business_unit'] : ''} />
                        {activeEdit
                            ? <>
                                <InputRow name={'Lokalizacja'} value={locationData?.location} onChange={(newValue) => inputHandler('location', newValue)} />
                                <InputRow name={'Opis'} value={locationData?.location_description} onChange={(newValue) => inputHandler('location_description', newValue)} />
                            </>
                            : <>
                                <DataRow name={'Lokalizacja'} value={locationData?.location} />
                                <DataRow name={'Opis'} value={locationData?.location_description} />
                            </>
                        }
                        {activeEdit && locationData?.id === ''
                            ? <SelectElementRow value={locationData?.stock ? 'tak' : 'nie'} name='Magazynek' onChange={(newValue) => inputHandler('stock', newValue)} elemetList={['tak', 'nie']} />
                            : <DataRow name={'Magazynek'} value={locationData?.stock ? 'tak' : 'nie'} />
                        }
                    </TableSimple>
                </div>
            </div>
            <div className='Buttons'>
                {(activeEdit) && <>
                    <Button name='Anuluj' buttonHandler={() => reloadDataAndSetSelect(locationId)} />
                    <Button name='Zapisz' buttonHandler={saveLocationData} />
                </>}
            </div>
            <Collapsible title={`Lista urządzeń (${locationData?.assetCount ? locationData.assetCount : '0'})`}>
                {locationId && <DeviceListInLocation locationId={locationId} />}
            </Collapsible>
        </div>
    )
}

export default LocationDetails
