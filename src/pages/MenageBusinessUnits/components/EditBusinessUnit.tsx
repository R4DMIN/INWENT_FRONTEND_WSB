import { useState, KeyboardEvent } from 'react'
import Button from '../../../components/Button/Button'
import TableSimple, { InputRow } from '../../../components/TableSimple/TableSimple'
import WindowOnTop from '../../../components/WindowOnTop/WindowOnTop'
import businessUnitsServices, { EditBussinesUnitInterface } from '../../../services/businessUnitsServices'
import { useSetAlertBoxContext } from '../../../context/AlertContexProvider'

interface EditBusinessUnitProps {
    /** funkcja która zamknie okno */
    closeWindow: () => void
    /** wykona się po porawnym dodaniu/edycji BU*/
    businessUnit?: EditBussinesUnitInterface
}

const EditBusinessUnit = ({ closeWindow, businessUnit }: EditBusinessUnitProps) => {
    const setAlertBox = useSetAlertBoxContext()
    const [editedBussinesUnit, setEditedBussinesUnit] = useState<EditBussinesUnitInterface>(businessUnit ? businessUnit : {
        full_name: '',
        short_name: '',
        city: '',
        zip_code: '',
        street: ''
    })

    /** osbługa skrótów klawiszowych */
    const keyboardShortcuts = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') saveHandler()
    }

    const inputHandler = (key: keyof EditBussinesUnitInterface, newValue: string) => {
        setEditedBussinesUnit((prev) => {
            return { ...prev, [key]: newValue }
        })
    }

    const saveHandler = async () => {
        if (!editedBussinesUnit.id) {
            businessUnitsServices.addNew(editedBussinesUnit, setAlertBox).then(() => closeWindow())
        }
        else {
            businessUnitsServices.update(editedBussinesUnit.id, editedBussinesUnit, setAlertBox).then(() => closeWindow())
        }
    }

    return <WindowOnTop title={(editedBussinesUnit.id ? 'Edyuj' : 'Utwórz') + ` jednostkę organizacyjną`} closeWindow={closeWindow} >
        <div className='AddBusinessUnit' onKeyDown={(e) => keyboardShortcuts(e)}>
            <div className='DataSection'>
                <TableSimple type='None'>
                    <InputRow name='Pełna nazwa' value={editedBussinesUnit.full_name} onChange={(newValue) => inputHandler('full_name', newValue)} />
                    <InputRow name='Krótka nazwa' value={editedBussinesUnit.short_name} onChange={(newValue) => inputHandler('short_name', newValue)} />
                    <InputRow name='Miasto' value={editedBussinesUnit.city} onChange={(newValue) => inputHandler('city', newValue)} />
                    <InputRow name='Kod pocztowy' value={editedBussinesUnit.zip_code} onChange={(newValue) => inputHandler('zip_code', newValue)} />
                    <InputRow name='Ulica' value={editedBussinesUnit.street} onChange={(newValue) => inputHandler('street', newValue)} />
                </TableSimple>
            </div>
            <div className='WindowOnTopButtonSection'>
                <Button name='Anuluj' buttonHandler={closeWindow} style={{ width: '50%' }} />
                <Button name='Zapisz' buttonHandler={saveHandler} style={{ width: '50%' }} />
            </div>
        </div>
    </WindowOnTop>
}

export default EditBusinessUnit