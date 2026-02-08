'use client';

import { createContext, Dispatch, SetStateAction, useContext, useMemo, useState } from 'react'

interface WorkSessionContextProps {
    step: number;
    setStep: Dispatch<SetStateAction<number>>;
    imgs: string[];
    setImgs: Dispatch<SetStateAction<string[]>>
}

export const WorkSessionContext = createContext<WorkSessionContextProps | null>(null);

export function WorkSessionProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [imgs, setImgs] = useState<string[]>([]);
    const [step, setStep] = useState<number>(0);

    const contextValue = useMemo<WorkSessionContextProps>(
        () => ({ imgs, setImgs, step, setStep }),
        [imgs, setImgs,step,setStep]
    );

    return <WorkSessionContext.Provider value={contextValue}>{children}</WorkSessionContext.Provider>
}

export function useWorkSession() {
    const context = useContext(WorkSessionContext);
    if (!context) {
        throw new Error("useWorkSession must be used within a WorkSessionContext.Provider");
    }
    return context;
}