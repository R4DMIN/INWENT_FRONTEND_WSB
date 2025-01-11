import React, { useEffect, useState } from 'react'
import SearchBar from '../../components/SearchBar/SearchBar.tsx'
import Button from '../../components/Button/Button.tsx'
import { useUserContextSelectedBusinessUnit } from '../../context/UserContextProvider.tsx'
import { useSetAlertBoxContext } from '../../context/AlertContexProvider.tsx'
import './Inventory.css'
import SelectLocationAssigment from '../../components/SelectLocationAssigment/SelectLocationAssigment.tsx'
import BoxLocation from '../../components/BoxLocation/BoxLocation.tsx'
import BoxModel from '../../components/BoxModel/BoxModel.tsx'
import SelectModel from '../../components/SelectModel/SelectModel.tsx'
import AlertBoxYesNo from '../../components/AlertBoxYesNo/AlertBoxYesNo.tsx'
import TableSimple, { DataRow, TextAreaRow } from '../../components/TableSimple/TableSimple.tsx'
import Loading from '../../components/Loading/Loading.tsx'
import InventScanList from '../../components/InventScanList/InventScanList.tsx'
import assetServices, { AssetInterface, InventAssetInterface } from '../../services/assetServices.tsx'

const Inventory = () => {
    const userBusinessUnit = useUserContextSelectedBusinessUnit()
    const [selectedAsset, setSelectedAsset] = useState<InventAssetInterface | null>(null)
    const [scanList, setScanList] = useState<AssetInterface[]>([])

    const [windowOnTop, setWindowOnTop] = useState<null | React.ReactNode>(null)
    const [loading, setLoading] = useState(false)
    const userBU = useUserContextSelectedBusinessUnit()?.id
    const setAlertBox = useSetAlertBoxContext()

    /** sprawdza czy wprowadzone SN jest już na liście  */
    const isOnScanList = (sn: string) => {
        if (scanList.length <= 0) return false
        return scanList.some(item => item.sn === sn)
    }

    /** usuwa asset o wskazanym ID z listy zeskanowanych  */
    const removeAssetFromScanList = (id: string) => {
        setScanList(scanList.filter((element) => element.id !== id))
        if (selectedAsset?.id === id) setSelectedAsset(null)
    }

    /** obsługa wyszukiwania assetu przyjmuje input: string który ma wyszkuać */
    const searchHandler = (input: string) => {
        // jeżeli nie ma wybranej jednostki organizacyjnej to return 
        if (!userBusinessUnit) {
            setAlertBox({ type: 'Warning', text: 'Nie wybrano jednostki organizacyjnej' })
            return
        }
        //jeżeli nie wprowadzono danych
        if (input === '') {
            setAlertBox({ type: 'Warning', text: 'Nie wprowadzono numeru seryjnego' })
            return
        }
        //sprawdź czy wskazane SN nie znajduje się już na liście zeskanownyc elementów
        if (isOnScanList(input)) {
            const index = scanList.findIndex(item => item.sn === input)
            setSelectedAsset(scanList[index])
            return
        }
        //wyszukaj wskazany numer seryjny w bazie danych
        setLoading(true)
        assetServices
            .findBySn(setAlertBox, input)
            .then(response => {
                if (response.find === 'inwent')
                    setSelectedAsset(response.data)
                else if (response.find === 'supplier')
                    setSelectedAsset({ ...response.data, id: response.data.sn, business_unit_ID: userBU })
                else if (response.find === 'none')
                    setWindowOnTop(<AlertBoxYesNo
                        title='Nie znaleziono urządzenia'
                        message={`Nie znaleziono urządzenia o numerze seryjnym '${input}' w systemie INWENT, sprawdź poprawność numeru seryjnego. Czy chcesz utworzyć nowy asset o podanym numnerze seryjnym?`}
                        type='warning'
                        closeWindow={() => setWindowOnTop(null)}
                        actionHandler={() => createNewAsset(input)}
                    />)
            })
            .finally(() => setLoading(false))
    }

    /** utworznie nowego assetu (nie znalezionego w danych dostawców) */
    const createNewAsset = (sn: string) => {
        setSelectedAsset({ sn: sn, id: sn, business_unit_ID: userBU })
    }

    /** Otwórz okono do wyboru lokalizacji assetu */
    const openSelectLocation = () => {
        setWindowOnTop(<SelectLocationAssigment getSelected={handleSelectedLocation} closeWindow={() => setWindowOnTop(null)} />)
    }

    const openSelectLocationForAll = () => {
        setWindowOnTop(<SelectLocationAssigment getSelected={handleSelectedLocationForAll} closeWindow={() => setWindowOnTop(null)} />)
    }

    /** obsługa przypisania lokalizacji */
    const handleSelectedLocation = (selectedLocationID: string) => {
        if (!selectedAsset) return
        else setSelectedAsset({ ...selectedAsset, assignment_location_ID: selectedLocationID })
    }

    const handleSelectedLocationForAll = (selectedLocationID: string) => {
        if (!scanList) return
        else setScanList(prev => prev.map((asset) => {
            const newAsset = { ...asset, assignment_location_ID: selectedLocationID }
            if (selectedAsset?.id === newAsset.id) setSelectedAsset(newAsset)
            return newAsset
        }))
    }

    /** Otwórz okno do wyboru modelu */
    const openSelectModel = () => {
        setWindowOnTop(<SelectModel getSelected={handleSelectedModel} closeWindow={() => setWindowOnTop(null)} />)
    }

    /** obsługa przypisania modelu */
    const handleSelectedModel = (selectedModelID: string) => {
        if (!selectedAsset) return
        else setSelectedAsset({ ...selectedAsset, model_ID: selectedModelID, newModel: true })
    }

    /** obsługa przycisku do potwierdzenia wielu urządzeń */
    const handleConfirmMultipleButton = () => {
        assetServices
            .inventAssetList(setAlertBox, scanList)
            .then(response => {
                setScanList(response)
                setSelectedAsset(null)
            })
    }

    /** obsługa przycisku do potwierdzenia danych */
    const handleConfirmButton = () => {
        if (!selectedAsset?.model_ID) {
            setAlertBox({ type: 'Error', text: 'Nie można zapisać urzadzenia bez przypisanego modelu.' })
            return
        }
        if (!selectedAsset?.assignment_location_ID) {
            setAlertBox({ type: 'Error', text: 'Nie można zapisać urzadzenia bez przypisanej lokalizacji.' })
            return
        }

        assetServices
            .inventAsset(setAlertBox, selectedAsset)
            .then(() => removeAssetFromScanList(selectedAsset.id))
    }

    /** obsługa wybrania assetu z listy zeskanowanych */
    const handleSelectFromList = (id: string | null) => {
        if (id) {
            const index = scanList.findIndex(item => item.id === id)
            setSelectedAsset(scanList[index])
        }
    }

    /** obsługa inputów */
    const textInputChange = (newValue: string, key: string) => {
        if (key !== 'description' || !selectedAsset) return
        setSelectedAsset({ ...selectedAsset, [key]: newValue })
    }

    useEffect(() => {
        if (selectedAsset) {
            setScanList(prevScanList => {
                const isDuplicate = prevScanList.some(item => item.id === selectedAsset.id)

                if (isDuplicate) {
                    // Nadpisanie istniejącego elementu, jeśli duplikat istnieje
                    return prevScanList.map(item =>
                        item.id === selectedAsset.id ? selectedAsset : item
                    )
                } else {
                    // Dodanie nowego elementu, jeśli nie ma duplikatu
                    return prevScanList.concat([selectedAsset])
                }
            })
        }
    }, [selectedAsset])

    if (!userBU) return

    return (
        <div className='Inventory'>
            {windowOnTop && windowOnTop}
            {loading && <Loading />}
            <div className='SearchSection'>
                <SearchBar width={450} searchHandler={searchHandler} placeholder='Podaj numer seryjny' />
            </div>
            <div className='DeviceBox'>
                <div className='DeviceSection'>
                    <div className='DataColumn'>
                        <TableSimple title={'Urządzenie:'}>
                            <DataRow name='Numer seryjny' value={selectedAsset?.sn} />
                            <DataRow name='Status' value={selectedAsset?.status} />
                            <DataRow name='Ostatnia inwentaryzacja' value={selectedAsset?.last_invent} />
                            <DataRow name='Koniec leasingu' value={selectedAsset?.leasing_end} />

                            {<TextAreaRow
                                name='Opis'
                                value={selectedAsset?.description ? selectedAsset.description : ''}
                                onChange={(newValue) => textInputChange(newValue, 'description')}
                            />}
                        </TableSimple>
                    </div>
                    {selectedAsset?.assignment_location_ID &&
                        <div className='DataColumn'>
                            <BoxLocation locationId={selectedAsset.assignment_location_ID} />
                        </div>
                    }
                    {selectedAsset?.model_ID &&
                        <div className='DataColumn'>
                            <BoxModel modelId={selectedAsset.model_ID} />
                        </div>
                    }
                </div>
            </div>
            <div className='ButtonBox'>
                <Button name='Potwierdź dane' buttonHandler={handleConfirmButton} disabled={!selectedAsset} />
                <Button name={selectedAsset?.assignment_location_ID ? 'Zmień lokalizację' : 'Przypisz lokalizację'} buttonHandler={openSelectLocation} disabled={!selectedAsset} />
                {!selectedAsset
                    ? <></>
                    : !selectedAsset.newModel
                        ? <Button name={'Przypisz model'} buttonHandler={openSelectModel} disabled={!selectedAsset || !(!selectedAsset.model_ID)} />
                        : <Button name={'Zmień model'} buttonHandler={openSelectModel} />
                }


            </div>
            <hr style={{ width: '90%' }}></hr>
            <div className='TablePage' style={{ width: '95%' }}>
                <div className='TablePageButtonSection'>
                    <Button name={`Potwierdź dane wszystkich (${scanList.length}) urządzeń`} buttonHandler={handleConfirmMultipleButton} disabled={scanList.length <= 1} />
                    <Button name={`Zmień lokalizację wszystkich (${scanList.length}) urządzeń`} buttonHandler={openSelectLocationForAll} disabled={scanList.length <= 1} />
                </div>
                <InventScanList
                    list={scanList}
                    handleSelect={handleSelectFromList}
                    selectedAssetId={selectedAsset ? selectedAsset.id : null}
                />
            </div>


        </div >
    )
}

export default Inventory