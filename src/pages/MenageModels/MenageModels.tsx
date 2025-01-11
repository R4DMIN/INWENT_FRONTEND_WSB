import './MenageModels.css'
import { useEffect, useState } from 'react'
import Table from '../../components/Table/Table.tsx'
import modelsServices from '../../services/modelsServices.tsx'
import ModelDetails from '../../components/ModelDetails/ModelDetails.tsx'
import Loading from '../../components/Loading/Loading.tsx'
import { ModelBaseInterface } from '../../services/modelsServices.tsx'
import { useSetAlertBoxContext } from '../../context/AlertContexProvider.tsx'
import Button from '../../components/Button/Button.tsx'
import { useUserContextRole } from '../../context/UserContextProvider.tsx'

const MenageModels = () => {
    const [modelList, setModelList] = useState<ModelBaseInterface[]>([])
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [activeEdit, setActiveEdit] = useState(false)

    const userRole = useUserContextRole()
    const specialAcces = (userRole && ['admin', 'powerUser'].includes(userRole)) ? true : false
    const setAlert = useSetAlertBoxContext()

    const loadModelsList = () => {
        setLoading(true)
        modelsServices
            .getModelList(setAlert)
            .then(response => setModelList(response))
            .finally(() => setLoading(false))
    }

    const reloadDataAndSetSelected = (id: string | void) => {
        setSelectedId(id ? id : null)
        setActiveEdit(false)
        loadModelsList()
    }

    const changeSelected = (id: string | null) => {
        setSelectedId(id)
        if (activeEdit) setActiveEdit(false)
    }

    const createNewModel = () => {
        setSelectedId(null)
        setActiveEdit(true)
    }

    const deleteModel = () => {
        if (selectedId) {
            modelsServices
                .deleteById(setAlert, selectedId)
                .then(() => reloadDataAndSetSelected())
        }
    }

    useEffect(() => {
        loadModelsList()
    }, [])

    return <div className='MenageModels'>
        {loading && <Loading />}
        <div className='TablePage'>
            {specialAcces && <div className='TablePageButtonSection'>
                <Button name='Utwórz nowy model' buttonHandler={createNewModel} />
                <Button name='Edytuj' buttonHandler={() => setActiveEdit(true)} disabled={!selectedId} />
                <Button name='Usuń' buttonHandler={deleteModel} disabled={!selectedId} />
            </div>}
            <Table
                columnConfig={[
                    { key: 'manufacturer', header: 'Producent' },
                    { key: 'model', header: 'Model' },
                    { key: 'device_type', header: 'Typ urządzenia' }
                ]}
                data={modelList}
                selectActionHandler={changeSelected}
                selectedId={selectedId}
                enableFilter={true}
                enableSort={true}
            />
        </div>
        <div style={{ margin: 10 }}>
            <ModelDetails modelId={selectedId} reloadParrentAndSetSelect={reloadDataAndSetSelected} activeEdit={activeEdit} cancelEdit={() => setActiveEdit(false)} />
        </div>
    </div>
}

export default MenageModels
