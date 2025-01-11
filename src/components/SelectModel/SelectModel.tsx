import Button from '../Button/Button.tsx'
import modelServices, { ModelBaseInterface } from '../../services/modelsServices.tsx'
import { useEffect, useState } from 'react'
import Table from '../Table/Table.tsx'
import Loading from '../Loading/Loading.tsx'
import { useSetAlertBoxContext } from '../../context/AlertContexProvider.tsx'
import WindowOnTop from '../WindowOnTop/WindowOnTop.tsx'

interface SelectModelProps {
    /** Funkcja która obsługuje wybranie modelu i otrzymuje jako prarametr ID modelu lub null w przypadku nie wybrania */
    getSelected(selectedId: string): void
    /** funkcja która zamknie okno */
    closeWindow: () => void
}

const SelectModel = ({ getSelected, closeWindow }: SelectModelProps) => {
    const [modelList, setModelList] = useState<ModelBaseInterface[]>([])
    const [selectedId, setSelectedId] = useState<string | null>(null)
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
        modelServices
            .getModelList(setAlert)
            .then(response => setModelList(response))
            .finally(() => setLoading(false))
    }, [setAlert])

    return <WindowOnTop title='Wybierz model' closeWindow={closeWindow}>
        {loading && <Loading />}
        <div className='WindowOnTopContent'>
            <Table
                columnConfig={[
                    { key: 'manufacturer', header: 'Producent' },
                    { key: 'model', header: 'Model' },
                    { key: 'device_type', header: 'Typ urządzenia' },
                ]}
                data={modelList}
                enableFilter={true}
                enableSort={true}
                selectActionHandler={(id) => setSelectedId(id)}
                selectedId={selectedId}
            />
        </div>

        <div className='WindowOnTopButtonSection'>
            <Button name={'ANULUJ'} buttonHandler={() => closeWindow()} />
            <Button name={'WYBIERZ'} buttonHandler={returnSelectedToParrent} />
        </div>
    </WindowOnTop>
}

export default SelectModel