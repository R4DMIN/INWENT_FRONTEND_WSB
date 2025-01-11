import React, { createContext, ReactNode, useContext, useState } from 'react'

export type AlertBoxType = 'Warning' | 'warning' | 'Ok' | 'ok' | 'Error' | 'error' | null

export interface AlertBoxStateInterface {
    type: AlertBoxType
    text: string
}

export type SetAlertType = (message: AlertBoxStateInterface) => void

type AlertBoxAction = AlertBoxStateInterface;

// Typ dla kontekstu
interface AlertBoxContextInterface {
    state: AlertBoxStateInterface;
    setAlertBox: React.Dispatch<AlertBoxAction>;
}

// Utwórz kontekst z domyślnymi wartościami
const AlertBoxContext = createContext<AlertBoxContextInterface | undefined>(undefined);

// Hook do użycia kontekstu
export const useAlertBoxContext = () => {
    const context = useContext(AlertBoxContext);
    if (!context) {
        throw new Error('useAlertBoxContext must be used within an AlertBoxContextProvider');
    }
    return context.state;
};

// Hook do ustawienia kontekstu
export const useSetAlertBoxContext = () => {
    const context = useContext(AlertBoxContext);
    if (!context) {
        throw new Error('useSetAlertBoxContext must be used within an AlertBoxContextProvider');
    }
    return context.setAlertBox;
};

// Typ dla komponentu provider
interface AlertBoxContextProviderProps {
    children: ReactNode;
}

// Komponent provider
export const AlertBoxContextProvider = ({ children }: AlertBoxContextProviderProps) => {
    const [state, setAlertBox] = useState<AlertBoxStateInterface>({ type: null, text: '' });

    return (
        <AlertBoxContext.Provider value={{ state, setAlertBox }}>
            {children}
        </AlertBoxContext.Provider>
    );
};

export default AlertBoxContext;