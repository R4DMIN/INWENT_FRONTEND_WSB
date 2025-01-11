import { useEffect, useState } from "react";
import WindowOnTop from "../WindowOnTop/WindowOnTop";
import businessUnitsServices, { BusinessUnitInteface } from "../../services/businessUnitsServices";
import { useSetAlertBoxContext } from "../../context/AlertContexProvider";
import Loading from "../Loading/Loading";
import Table from "../Table/Table";
import Button from "../Button/Button";
import userServices from "../../services/userServices";

interface SelectFromListProps {
    /** */
    userID: string
    /**funkcja zamykająca okno */
    closeWindow(): void
}

const SelectBusinessUnit = ({ userID, closeWindow }: SelectFromListProps) => {
    const [businessUnitList, setBusinessUnitsList] = useState<BusinessUnitInteface[]>([])
    const setAlert = useSetAlertBoxContext()
    const [loading, setLoading] = useState(false)
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    const saveUserBusinessUnits = () => {
        userServices
            .saveUserBusinessUnits(setAlert, userID, selectedIds)
            .then(() => {
                closeWindow()
            })
    }

    useEffect(() => {
        setLoading(true)
        businessUnitsServices.getList(setAlert)
            .then((response) => {
                setBusinessUnitsList(response)
            })
            .finally(() => { setLoading(false) })

        userServices.getUserBusinessUnitsIDs(setAlert, userID)
            .then(response => {
                setSelectedIds(response)
            })

    }, [setAlert, userID])

    return <WindowOnTop title='Wybierz lokalizację' closeWindow={closeWindow}>
        {loading && <Loading />}
        <div className='WindowOnTopContent'>
            <Table
                columnConfig={[
                    { key: 'id', header: 'ID' },
                    { key: 'full_name', header: 'Nazwa' },
                    { key: 'short_name', header: 'Krótka nazwa' },
                    { key: 'city', header: 'Miasto' },
                ]}
                data={businessUnitList}
                enableFilter={true}
                checkBoxActionHandler={(ids) => setSelectedIds(ids)}
                selectedIds={selectedIds}
            />
        </div>
        <div className='WindowOnTopButtonSection'>
            <Button name={'ANULUJ'} buttonHandler={() => closeWindow()} />
            <Button name={'WYBIERZ'} buttonHandler={saveUserBusinessUnits} />
        </div>
    </WindowOnTop>
}

export default SelectBusinessUnit
