import { ReactElement, ReactNode, useState } from 'react'
import './WindowsTabs.css'

interface WindowsTabsProps {
    children: (ReactElement<{ name: string }> | null)[];
    defaultTab?: number | null;
}

const WindowsTabs = ({ children, defaultTab = null }: WindowsTabsProps) => {
    const [activeTab, setActiveTab] = useState<number | null>(defaultTab)

    const changeTab = (tabNumber: number) => {
        if (activeTab === tabNumber)
            setActiveTab(null)
        else
            setActiveTab(tabNumber)
    }
    return <div className='WindowsTabs'>
        <div className='TabsSection'>
            <div className='TabsButtons'>
                {children.map((element, index) => {
                    if (element) return <button key={index} className={'Button ' + (activeTab === index ? 'Selected' : '')} onClick={() => changeTab(index)}>{element.props.name}</button>
                    else return false
                })}
            </div>
        </div>
        <div className='WindowSection'>
            {activeTab !== null && children[activeTab]}
        </div>
    </div>
}

interface TabProps {
    children: ReactNode;
    name: string;
}

const Tab = ({ children }: TabProps) => {

    return <>{children}</>
}

export { WindowsTabs, Tab }