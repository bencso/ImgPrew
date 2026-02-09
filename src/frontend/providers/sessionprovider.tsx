'use client';

import { createContext, Dispatch, SetStateAction, useContext, useMemo, useState } from 'react'

interface WorkSessionContextProps {
    step: number;
    setStep: Dispatch<SetStateAction<number>>;
    imgs: string[];
    setImgs: Dispatch<SetStateAction<string[]>>;
    selectedImg: number;
    setSelectedImg: Dispatch<SetStateAction<number>>;
}

export const WorkSessionContext = createContext<WorkSessionContextProps | null>(null);

export function WorkSessionProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [imgs, setImgs] = useState<string[]>([]);
    const [step, setStep] = useState<number>(0);
    const [selectedImg, setSelectedImg] = useState<number>(0);

    const contextValue = useMemo<WorkSessionContextProps>(
        () => ({ imgs, setImgs, step, setStep, selectedImg, setSelectedImg }),
        [imgs, setImgs, step, setStep, selectedImg, setSelectedImg]
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