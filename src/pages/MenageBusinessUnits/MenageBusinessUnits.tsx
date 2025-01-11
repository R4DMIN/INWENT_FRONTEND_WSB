import { ReactNode, useEffect, useState } from 'react'
import businessUnitsServices, { BusinessUnitInteface } from '../../services/businessUnitsServices'
import Table from '../../components/Table/Table'
import EditBusinessUnit from './components/EditBusinessUnit'
import { useSetAlertBoxContext } from '../../context/AlertContexProvider'
import AlertBoxYesNo from '../../components/AlertBoxYesNo/AlertBoxYesNo'
import Button from '../../components/Button/Button'
import Loading from '../../components/Loading/Loading'

const BusinessUnits = () => {
    const setAlert = useSetAlertBoxContext()
    const [businessUnitsList, setBusinessUnits] = useState<BusinessUnitInteface[]>([])
    const [loading, setLoading] = useState(false)
    const [selected, setSelected] = useState<null | string>(null)
    const [windowOnTop, setWindowOnTop] = useState<ReactNode | null>(null)

    const openAddBusinessUnitWindow = () => {
        setWindowOnTop(<EditBusinessUnit closeWindow={closeAndRefresch} />)
    }

    const openEditBusinessUnitWindow = () => {
        if (!selected) return
        else {
            const selectedData = businessUnitsList.filter((bu) => bu.id === selected)[0]
            setWindowOnTop(<EditBusinessUnit closeWindow={closeAndRefresch} businessUnit={selectedData} />)
        }
    }

    const closeAndRefresch = () => {
        setWindowOnTop(null)
        businessUnitsServices.getList(setAlert).then(response => setBusinessUnits(response))
    }

    const deleteHandler = () => {
        if (!selected) return
        const selectedData = businessUnitsList.filter((bu) => bu.id === selected)[0]

        setWindowOnTop(<AlertBoxYesNo
            title='Uwaga'
            type='warning'
            message={`Czy na pewno chcesz usunąć jednostkę organizacyjną ${selectedData.full_name} ?`}
            closeWindow={() => setWindowOnTop(null)}
            actionHandler={() => {
                setSelected(null)
                businessUnitsServices.deleteById(selectedData.id, setAlert).then(() => closeAndRefresch())
            }}
        />)
    }

    useEffect(() => {
        setLoading(true)
        businessUnitsServices
            .getList(setAlert)
            .then(response => setBusinessUnits(response))
            .finally(() => setLoading(false))
    }, [setAlert])

    console.log(businessUnitsList);
    

    return <div className='TablePage'>
        {windowOnTop && windowOnTop}
        <div className='TablePageButtonSection' >
            <Button name='Dodaj jednostkę organizacyjną' buttonHandler={openAddBusinessUnitWindow} />
            <Button name='Edytuj zaznaczony' buttonHandler={openEditBusinessUnitWindow} disabled={!selected ? true : false} />
            <Button name='Usuń zaznaczony' buttonHandler={deleteHandler} disabled={!selected ? true : false} />
            {/* <Button name='Pokaż assety' buttonHandler={} disabled={!selected ? true : false} /> */}
        </div>
        {loading && <Loading />}
        <Table
            columnConfig={[
                { key: 'id', header: 'ID' },
                { key: 'short_name', header: 'Krótka nazwa' },
                { key: 'full_name', header: 'Nazwa' },
                { key: 'city', header: 'Miasto' },
                { key: 'street', header: 'Adres' }
            ]}
            data={businessUnitsList}
            selectedId={selected}
            selectActionHandler={setSelected}
        />
    </div>
}

export default BusinessUnits