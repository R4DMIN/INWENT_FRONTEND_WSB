import './ModelDetails.css'
import { ChangeEvent, useCallback } from 'react'
import { useEffect, useState, useRef } from 'react'
import modelsServices, { ModelDetailsInterface, ModelToAddInterface, ModelToUpdateInterface } from '../../services/modelsServices.tsx'
import Button from '../Button/Button.tsx'
import Loading from '../Loading/Loading.tsx'
import { useSetAlertBoxContext } from '../../context/AlertContexProvider.tsx'
import { WindowsTabs, Tab } from '../WindowTabs/WindowsTabs.tsx'
import placeholder from './../../assets/placeholder.png'
import TableSimple, { DataRow, InputRow, TextAreaRow, SelectElementRow, InputAutoCompleteRow } from '../TableSimple/TableSimple.tsx'
import DeviceListForModel from '../DeviceList/DeviceListForModel.tsx'
import Table from '../Table/Table.tsx'
import suppliersDataServices, { BaseSupplierAssetModel } from '../../services/suppliersDataServices.tsx'

interface ModelDetailsProps {
    /** ID aktualnie wybranego modelu, przyjmuje też wartość null kiedy żaden model nie jest wybrany */
    modelId: string | null,
    /** funkcja służąca do przeładowania danych komponentu z którego jest wywoływany i zmiany wybranego id  */
    reloadParrentAndSetSelect(id: string | void): void
    /** czy model ma być edytowalny */
    activeEdit: boolean
    /** anulowanie edycji */
    cancelEdit: () => void
}

const ModelDetails = ({ modelId, reloadParrentAndSetSelect, activeEdit, cancelEdit }: ModelDetailsProps) => {
    const [modelData, setModelData] = useState<ModelDetailsInterface>({
        id: '',
        manufacturer: '',
        model: '',
        device_type: '',
        model_description: '',
    })

    const isNew = modelData.id === '' ? true : false

    const [photoUpdated, setPhotoUpdated] = useState<boolean>(false)
    const [descriptionUpdated, setDesriptionUpdated] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const setAlertBox = useSetAlertBoxContext()
    const [manufacturerHints, setManufacturerHints] = useState<string[]>([])
    const [boundedList, setBoundedList] = useState<BaseSupplierAssetModel[]>([])

    const fileInputRef = useRef<HTMLInputElement>(null)

    /** Lista typów urządzeń możliwych do uzupełnienia */
    const deviceTypeList = ['Komputer', 'Monitor', 'Akcesoria', 'Czytnik Cen', 'Drukarka', 'Smartphone', 'Skaner kodów', 'Laptop', 'Stacja Dokująca', 'Inne']

    /** obsługa inputów */
    const inputHandler = (key: string, value: string) => {
        if (!isNew && !descriptionUpdated && key === 'model_description') {
            setDesriptionUpdated(true)
        }
        if (!modelData) return
        setModelData({ ...modelData, [key]: value })
    }

    /** jeżeli modelId nie jest null to wczytuje dane modelu z backend */
    const loadModelData = useCallback((modelId: string | null) => {
        if (!modelId) setModelData({
            id: '',
            manufacturer: '',
            model: '',
            device_type: '',
            model_description: '',
        })
        else {
            setLoading(true)
            modelsServices
                .getModelDetails(modelId, setAlertBox)
                .then(response => setModelData(response))
                .finally(() => setLoading(false))

            suppliersDataServices
                .getBoundedModels(setAlertBox, modelId)
                .then(response => setBoundedList(response))
        }

    }, [setAlertBox])

    /** Zapisuje dane nowego modelu następnie przeładowuje dane parrenta, wyłącza edycje, i wczytuje dane zwrócone przez serwis */
    const saveNewModel = () => {
        if (modelData && isNew) {
            const newModel: ModelToAddInterface = {
                manufacturer: modelData.manufacturer,
                model: modelData.model,
                device_type: modelData.device_type,
                model_description: modelData.model_description,
                photo: modelData.photo
            }
            modelsServices
                .addNew(newModel, setAlertBox)
                .then(response => reloadParrentAndSetSelect(response))
        }
    }

    /** aktualizuje dane zdjęcia i/lub opisu jeżeli któreś z nich zostało zmienione */
    const updateModelData = () => {
        if ((descriptionUpdated || photoUpdated) && modelData) {
            const dataToUpdate: ModelToUpdateInterface = {}
            if (descriptionUpdated) dataToUpdate.model_description = modelData.model_description
            if (photoUpdated) dataToUpdate.photo = modelData.photo

            modelsServices
                .updateById(modelData.id, dataToUpdate, setAlertBox)
                .then(() => reloadData())

        } else setAlertBox({ type: 'Warning', text: `Nie zmieniono żadnych danych.` })
    }

    /** wyłącza edytowanie danych i ponownie ładuje dane */
    const reloadData = () => {
        loadModelData(modelId)
        cancelEdit()
    }

    /** pobiera listę producentów */
    const loadManufacturerHints = () => {
        modelsServices
            .getManufacturerList()
            .then(result => setManufacturerHints(result))
    }

    /** Obsługa zaladowania pliku, sprawdza poprawność typu przesłanego pliku oraz konwerutuje go do formatu base64 */
    const uploadPhoto = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        //sprawdź czy plik został wybrany
        if (!event.target.files) {
            setAlertBox({ type: 'Warning', text: 'Nie wybrano pliku' })
            return
        }
        const file = event.target.files[0]
        //sprawdź czy plik jest obrazem
        if (!file.type.startsWith('image/')) {
            setAlertBox({ type: 'Warning', text: `Nieprawidłowy format pliku "${file.type}", wybierz poprawny plik graficzny.` })
            if (fileInputRef.current) fileInputRef.current.value = ''
            return
        }

        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            if (typeof reader.result === 'string' && modelData) {
                setModelData({ ...modelData, photo: reader.result })
                //oznacz że zdjęcie zostało zmienione
                setPhotoUpdated(true)
            } else {
                console.error("Oczekiwano, że wynik będzie typu 'string', ale otrzymano: ", reader.result)
                setAlertBox({ type: 'Error', text: `Wystąpił błąd.` })
                if (fileInputRef.current) fileInputRef.current.value = ''
            }
        }
        reader.onerror = (error) => {
            console.error('Error', error)
        }
    }

    useEffect(() => {
        loadModelData(modelId)
        if (isNew) loadManufacturerHints()
    }, [loadModelData, modelId])

    return <div className={`ModelDetails${!modelData ? ' close' : ''}`}>
        {loading && <Loading />}
        <div className='ModelInfo'>
            <div className='ModelInfo'>
                <div className='PhotoSection'>
                    <img src={modelData?.photo ? modelData.photo : placeholder} alt='asset model' />
                    <input hidden type='file' accept='image/*' ref={fileInputRef} onChange={(event) => uploadPhoto(event)} />
                </div>
                <div className='DataSection'>
                    <TableSimple>
                        {(isNew && activeEdit)
                            ? <>
                                <InputAutoCompleteRow value={modelData.manufacturer} name='Producent' onChange={(newValue => inputHandler('manufacturer', newValue))} hintsArray={manufacturerHints} />
                                <InputRow value={modelData.model} name='Model' onChange={(newValue => inputHandler('model', newValue))} />
                                <SelectElementRow value={modelData.device_type} name='Typ urządzenia' onChange={(newValue => inputHandler('device_type', newValue))} elemetList={deviceTypeList} />
                            </>
                            : <>
                                <DataRow name='Producent' value={modelData.manufacturer} />
                                <DataRow name='Model' value={modelData.model} />
                                <DataRow name='Typ urządzenia' value={modelData.device_type} />
                            </>
                        }
                        <TextAreaRow
                            name='Opis'
                            value={modelData['model_description']}
                            disabled={!activeEdit}
                            onChange={(newValue => inputHandler('model_description', newValue))}
                            rows={8} cols={30} />
                    </TableSimple>
                </div>
            </div>
        </div>

        <div className='Section Buttons'>
            {(activeEdit || photoUpdated) && <>
                <Button name='Anuluj' buttonHandler={reloadData} />
                <Button name={modelData.photo ? 'Aktualizuj zdjęcie' : 'Dodaj zdjęcie'} buttonHandler={() => fileInputRef.current?.click()} />
                {isNew
                    ? <Button name='Utwórz model' buttonHandler={saveNewModel} />
                    : <Button name='Zapisz zmiany' buttonHandler={updateModelData} />
                }
            </>}
        </div>

        <WindowsTabs defaultTab={0}>
            <Tab name='Szczegóły'>
                <div></div>
            </Tab>
            {modelId ? <Tab name={`Lista Urządzeń (${modelData?.asset_count ? modelData.asset_count : '0'})`}>
                <DeviceListForModel modelId={modelId} />
            </Tab> : null}
            <Tab name='Przypisane modele'>
                <div style={{ padding: 10 }}>
                    <Table
                        columnConfig={[
                            { key: 'id', header: 'ID', style: { maxWidth: 120 } },
                            { key: 'supplier_key', header: 'supplier_key Seryjny' },
                            { key: 'supplier_model', header: 'supplier_model' },
                        ]}
                        data={boundedList}
                    />
                </div>
            </Tab>
        </WindowsTabs>
    </div>
}

export default ModelDetails