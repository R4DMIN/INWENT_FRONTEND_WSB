import React, { useState } from 'react'
import './Tools.css'
import Button from '../../components/Button/Button.tsx'
import toolsService from '../../services/toolsServices.tsx'
import { useSetAlertBoxContext } from '../../context/AlertContexProvider.tsx'
import Collapsible from '../../components/Collapsible/Collapsible.tsx'
import MenageUser from '../MenageUsers/MenageUsers.tsx'
import MenageBusinessUnits from '../MenageBusinessUnits/MenageBusinessUnits.tsx'
import suppliersDataServices from '../../services/suppliersDataServices.tsx'
import SuppliersModelsPage from './components/SuppliersModelsPage.tsx'


const Tools = () => {
    return <div className='Tools'>
        <Collapsible title='Zarządzaj użytkownikami'>
            <MenageUser />
        </Collapsible>
        <Collapsible title='Zarządzaj jednostkami organizacyjnymi'>
            <MenageBusinessUnits />
        </Collapsible>
        <Collapsible title='Modele dostawców'>
            <SuppliersModelsPage />
        </Collapsible>
        <Collapsible title='Narzędzia dostawcy TESMA'>
            <ToolsBoxTesma />
        </Collapsible>
    </div >
}

const ToolsBoxTesma = () => {
    const setAlertBox = useSetAlertBoxContext()
    const [file, setFile] = useState<null | File>(null)

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files)
            setFile(files[0])
    }

    const sendSelectedFile = () => {
        if (file)
            toolsService
                .tesmaCsvUpload(file)
                .then(response => {
                    setAlertBox(response.message)
                })
                .catch(error => {
                    console.error(error);
                })
    }

    const processSuplierModels = () => {
        suppliersDataServices.processModels(setAlertBox)
    }

    return <div className='Tools'>
        <h3> Dane z TESMA</h3>
        <input type='file' name='file' onChange={handleFileSelect} accept='.csv' />
        <Button name='wyśli' buttonHandler={sendSelectedFile} />
        <Button name='załaduj modele' buttonHandler={processSuplierModels} />
    </div>
}

export default Tools