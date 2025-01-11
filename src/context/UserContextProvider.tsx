import React, { createContext, ReactNode, useContext, useReducer } from 'react'
import { BusinessUnitBaseInteface } from '../services/businessUnitsServices'


export type RoleType = 'admin' | 'user' | 'powerUser'

export interface UserInterface {
    email: string
    firstName: string
    lastName: string
    role: RoleType
    selectedBusinessUnit: BusinessUnitBaseInteface | null
}

export type UserStateInterface = UserInterface | null

interface ChangeBUAction {
    type: 'changeBU'
    data: BusinessUnitBaseInteface
}

interface LoadUserAction {
    type: 'loadUser'
    user: UserInterface
}
interface ClearUserAction {
    type: 'clear'
}

type Action = ChangeBUAction | LoadUserAction | ClearUserAction

// Funkcja reduktora do obsługi zmian stanu
const userStateChange = (state: UserStateInterface, action: Action): UserStateInterface => {
    switch (action.type) {
        case 'changeBU':
            return state ? { ...state, selectedBusinessUnit: action.data ? action.data : null } : null
        case 'loadUser':
            return action.user ? action.user : state
        case 'clear':
            return null
        default:
            return state
    }
}

// Typ kontekstu
type UserContextType = [UserStateInterface, React.Dispatch<Action>]

// Ustawienie domyślnego typu kontekstu jako undefined
const UserContext = createContext<UserContextType | null>(null)

// Hook do pobierania całego kontekstu
export const useUserContext = (): UserContextType => {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error('useUserContext must be used within a UserContextProvider')
    }
    return context
}

// Hook do pobierania wybranej jednostki biznesowej
export const useUserContextSelectedBusinessUnit = (): BusinessUnitBaseInteface | null => {
    const [user] = useUserContext()
    return user ? user.selectedBusinessUnit : null
}

//Hook do pobieranie roli użytkownika
export const useUserContextRole = (): RoleType | null => {
    const [user] = useUserContext()
    return user ? user.role : null
}

// Hook do pobierania danych użytkownika
export const useUserContextRead = (): UserStateInterface => {
    const [user] = useUserContext()
    return user
}

//Hook do ustawiania danych użytkownika
export const useSetUserContext = () => {
    const context = useContext(UserContext)
    if (!context)
        throw new Error('useSetUserFContext must be used within an AlertBoxContextProvider')
    return (user: UserInterface) => context[1]({ type: 'loadUser', user: user })
}

//Hook do czyszczenia danych użytkownika
export const useClearUserContext = () => {
    const context = useContext(UserContext)
    if (!context)
        throw new Error('useSetUserFContext must be used within an AlertBoxContextProvider')
    return () => context[1]({ type: 'clear' })
}

//Hook do weryfikacji czy użytkownik jest zalogowany
export const useUserContextLogged = () => {
    const context = useContext(UserContext)
    if (!context)
        throw new Error('useSetUserFContext must be used within an AlertBoxContextProvider')
    return (context[0] ? true : false)
}

interface UserContextProviderProps {
    children: ReactNode
}
// Provider dla kontekstu użytkownika
export const UserContextProvider = ({ children }: UserContextProviderProps) => {
    const [user, setUser] = useReducer<React.Reducer<UserStateInterface, Action>>(userStateChange, null)

    return (
        <UserContext.Provider value={[user, setUser]}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContext