import { useEffect, useState } from 'react'
import locationService, { LocationBaseInterface } from '../../services/locationServices.tsx'
import Table from '../../components/Table/Table.tsx'
import Loading from '../../components/Loading/Loading.tsx'
import LocationDetails from '../../components/LocationDetails/LocationDetails.tsx'
import './ManageLocation.css'
import { useUserContextSelectedBusinessUnit } from '../../context/UserContextProvider.tsx'
import { useSetAlertBoxContext } from '../../context/AlertContexProvider.tsx'
import Button from '../../components/Button/Button.tsx'

const ManageLocation = () => {
    const userBusinessUnit = useUserContextSelectedBusinessUnit()

    const [locationList, setLocationList] = useState<LocationBaseInterface[]>([])
    const [selectedId, setSelectedId] = useState<null | string>(null)
    const [loading, setLoading] = useState(false)
    const [activeEdit, setActiveEdit] = useState(false)
    const setAlertBox = useSetAlertBoxContext()

    const reloadDataAndSetSelect = (id: string | null) => {
        setSelectedId(id)
        if (userBusinessUnit) {
            setLoading(true)
            locationService
                .getAllLocationInBusinessUnit(setAlertBox, userBusinessUnit.id)
                .then((response) => setLocationList(response))
                .finally(() => setLoading(false))
        }
        else setLocationList([])
        setActiveEdit(false)
    }

    const selectId = (id: string | null) => {
        setSelectedId(id)
        setActiveEdit(false)
    }

    const createNewModel = () => {
        setSelectedId(null)
        setActiveEdit(true)
    }

    const deleteLocation = () => {
        if (selectedId)
            locationService
                .deleteById(setAlertBox, selectedId)
                .then(() => reloadDataAndSetSelect(null))
    }

    useEffect(() => {
        if (userBusinessUnit) {
            setLoading(true)
            locationService
                .getAllLocationInBusinessUnit(setAlertBox, userBusinessUnit.id)
                .then((response) => setLocationList(response))
                .finally(() => setLoading(false))
        }
    }, [userBusinessUnit, setAlertBox])

    return (
        <div className={'ManageLocation ' + (!userBusinessUnit ? ' blur' : '')}>
            {loading && <Loading />}
            <div className='TablePage'>
                <div className='TablePageButtonSection'>
                    <Button name='Utwórz nową lokalizację' buttonHandler={createNewModel} />
                    <Button name='Edytuj' buttonHandler={() => setActiveEdit(true)} disabled={!selectedId} />
                    <Button name='Usuń' buttonHandler={deleteLocation} disabled={!selectedId} />
                </div>
                <Table
                    columnConfig={[
                        { key: 'business_unit', header: 'Jednostka organizacyjna' },
                        { key: 'location', header: 'Lokalizacja' },
                        { key: 'location_description', header: 'Opis' }
                    ]}
                    data={locationList}
                    selectActionHandler={selectId}
                    selectedId={selectedId}
                    enableSort={true}
                />
            </div>
            <div>
                <LocationDetails locationId={selectedId} reloadDataAndSetSelect={reloadDataAndSetSelect} activeEdit={activeEdit} cancelEdit={() => setActiveEdit(false)} />
            </div>
        </div >
    )
}

export default ManageLocation