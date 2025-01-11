import Button from '../Button/Button.tsx'
import Table from '../Table/Table.tsx'
import Loading from '../Loading/Loading.tsx'
import locationService, { LocationBaseInterface } from '../../services/locationServices.tsx'
import { useUserContextSelectedBusinessUnit } from '../../context/UserContextProvider.tsx'
import { useEffect, useState } from 'react'
import { useSetAlertBoxContext } from '../../context/AlertContexProvider.tsx'
import WindowOnTop from '../WindowOnTop/WindowOnTop.tsx'

interface SelectAssigmentProps {
    /** funkcja która obsłuż wybrane ID które zostanie przekazane jako argument id:string */
    getSelected: (id: string) => void
    /** funkcja która zamknie okno */
    closeWindow: () => void
}

const SelectAssigment = ({ getSelected, closeWindow }: SelectAssigmentProps) => {
    const userBusinessUnit = useUserContextSelectedBusinessUnit()
    const [data, setData] = useState<LocationBaseInterface[]>([])
    const [selectedId, setSelectedId] = useState<null | string>(null)
    const [loading, setLoading] = useState(false)
    const setAlert = useSetAlertBoxContext()

    const returnSelectedToParrent = () => {
        if (!selectedId) setAlert({ type: 'Warning', text: `Nie wybrano żadnej pozycji.` })
        else {
            getSelected(selectedId)
            closeWindow()
        }
    }

    useEffect(() => {
        if (!userBusinessUnit) return
        setLoading(true)
        locationService
            .getAllLocationInBusinessUnit(setAlert, userBusinessUnit.id)
            .then(response => setData(response))
            .finally(() => setLoading(false))
    }, [setAlert, userBusinessUnit])

    return <WindowOnTop title='Wybierz lokalizację' closeWindow={closeWindow}>
        {loading && <Loading />}
        <div className='WindowOnTopContent'>
            <Table
                columnConfig={[{ key: 'business_unit', header: 'Jednostka organizacyjna' }, { key: 'location', header: '' }, { key: 'location_description', header: 'Opis' }]}
                data={data}
                selectActionHandler={(id) => setSelectedId(id)}
                selectedId={selectedId}
                enableFilter={true}
            />
        </div>
        <div className='WindowOnTopButtonSection'>
            <Button name={'ANULUJ'} buttonHandler={() => closeWindow()} />
            <Button name={'WYBIERZ'} buttonHandler={returnSelectedToParrent} />
        </div>
    </WindowOnTop>
}

export default SelectAssigment