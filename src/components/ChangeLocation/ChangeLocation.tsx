import './ChangeLocation.css'
import Button from '../Button/Button.tsx'
import SelectElement from '../SelectElement/SelectElement.tsx'
import { useEffect, useState } from 'react'
import { useUserContext } from '../../context/UserContextProvider.tsx'
import WindowOnTop from '../WindowOnTop/WindowOnTop.tsx'
import { BusinessUnitBaseInteface } from '../../services/businessUnitsServices.tsx'
import { useSetAlertBoxContext } from '../../context/AlertContexProvider.tsx'
import userServices from '../../services/userServices.tsx'

interface ChangeLocationProps {
    closeHandler: () => void
}

const ChangeLocation = ({ closeHandler }: ChangeLocationProps) => {
    const setAlertBox = useSetAlertBoxContext()
    const [businessUnitList, setBusinessUnitList] = useState<BusinessUnitBaseInteface[]>([])
    const [user, setUser] = useUserContext()
    const [selectedLocation, setSelectedLocation] = useState(user ? user.selectedBusinessUnit : null)

    useEffect(() => {
        userServices.getUserBusinessUnits(setAlertBox).then(response => setBusinessUnitList(response))
    }, [setAlertBox])

    const saveHandler = () => {
        if (selectedLocation) {
            setUser({ type: 'changeBU', data: selectedLocation })
            userServices.saveActiveBusinessUnit(setAlertBox, selectedLocation.id)
        }
        if (closeHandler) closeHandler()
    }

    return <WindowOnTop closeWindow={closeHandler} title='Wybierz Jednostkę organizacyjną'>
        <div style={{ display: 'flex', justifyContent: 'center' }} >
            <SelectElement
                elementList={businessUnitList.map((bu) => bu.short_name)}
                value={selectedLocation ? selectedLocation.short_name : ''}
                onChange={(newValue) => setSelectedLocation(businessUnitList.filter((bu) => bu.short_name === newValue)[0])}
                style={{ width: '400px' }}
            />
        </div>
        <div className='WindowOnTopButtonSection'>
            <Button name={'Anuluj'} buttonHandler={closeHandler} />
            <Button name={'Zapisz'} buttonHandler={saveHandler} />

        </div></WindowOnTop>
}

export default ChangeLocation