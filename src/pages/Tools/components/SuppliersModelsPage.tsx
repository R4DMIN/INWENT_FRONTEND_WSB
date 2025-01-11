import Table from '../../../components/Table/Table.tsx'
import Loading from '../../../components/Loading/Loading.tsx'
import SelectModel from '../../../components/SelectModel/SelectModel.tsx'
import AlertBoxYesNo from '../../../components/AlertBoxYesNo/AlertBoxYesNo.tsx'
import { useSetAlertBoxContext } from '../../../context/AlertContexProvider.tsx'
import { ReactNode, useEffect, useState } from 'react'
import suppliersDataServices, { SupplierAssetModel } from '../../../services/suppliersDataServices'
import Button from '../../../components/Button/Button.tsx'


const SuppliersModelsPage = () => {
    const setAlert = useSetAlertBoxContext()
    const [loading, setLoading] = useState(false)
    const [filterBounded, setFilterBounded] = useState(true)
    const [modelList, setModelList] = useState<SupplierAssetModel[]>([])
    const [windowOnTop, setWindowOnTop] = useState<null | ReactNode>(null)
    const [selected, setSeleted] = useState<null | string>(null)

    const loadData = () => {
        setLoading(true)
        suppliersDataServices
            .getModels(setAlert, filterBounded)
            .then(data => setModelList(data))
            .finally(() => setLoading(false))
    }

    const openSelectModelWindow = () => {
        setWindowOnTop(
            <SelectModel getSelected={boundModels} closeWindow={() => setWindowOnTop(null)} />
        )
    }

    const boundModels = (modelID: string) => {
        if (!selected) return
        suppliersDataServices.boundModels(setAlert, selected, modelID).then(() => loadData())
    }

    const unboundModels = () => {
        if (!selected) return
        suppliersDataServices.unboundModels(setAlert, selected).then(() => loadData())
    }

    const openUnboundAlert = () => {
        if (!selected) return
        const model = modelList.filter(element => element.id === selected)[0]
        if (!model || !model.model_ID) return
        setWindowOnTop(<AlertBoxYesNo
            title='Usunąć przypisanie modelu'
            type='warning'
            message={`Czy na pewno chcesz usunąć przypisanie "${model.supplier_model}"(${model.supplier_key}) do ${model.model}`}
            closeWindow={() => setWindowOnTop(null)}
            actionHandler={unboundModels}
        />)
    }

    useEffect(loadData, [filterBounded, setAlert])

    return <div className='TablePage'>
        {loading && <Loading />}
        {windowOnTop && windowOnTop}
        <div className='TablePageButtonSection'>
            <Button name={filterBounded ? 'Pokaż wszystkie' : 'Pokaż nieprzypisane'} buttonHandler={() => setFilterBounded(prev => !prev)} />
            <Button name='Przypisz model' buttonHandler={openSelectModelWindow} disabled={!selected} />
            <Button name='Usuń przypisanie' buttonHandler={openUnboundAlert} disabled={!selected} />
        </div>

        <Table
            columnConfig={[
                { key: 'id', header: 'ID', style: { maxWidth: '60px', width: '60px' } },
                { key: 'supplier_key', header: 'supplier_key' },
                { key: 'supplier_model', header: 'supplier_model' },
                { key: 'model_ID', header: 'INW_MODEL_ID' },
                { key: 'manufacturer', header: 'Producent' },
                { key: 'model', header: 'Model' },
                { key: 'device_type', header: 'Typ urządzenia' }
            ]}
            data={modelList}
            enableFilter={true}
            enableSort={true}
            selectedId={selected}
            selectActionHandler={setSeleted}
            enableFooter={true}
            maxOnPageProps={20}
        />
    </div>
}

export default SuppliersModelsPage