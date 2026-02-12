'use client';

import { WorkSessionContextProps } from '@/interfaces/interface';
import { useFunctionsStore } from '@/stores/functionsStore';
import { createContext, useContext, useMemo, useState, ReactNode } from 'react';

export const WorkSessionContext = createContext<WorkSessionContextProps | null>(null);

interface WorkSessionProviderProps {
    children: ReactNode;
}

export function WorkSessionProvider({ children }: WorkSessionProviderProps) {
    const [imgs, setImgs] = useState<string[]>([]);
    const [step, setStep] = useState<number>(0);
    const [selectedImg, setSelectedImg] = useState<number>(0);

    const { functions, addFunction, editFunction } = useFunctionsStore();

    const contextValue = useMemo<WorkSessionContextProps>(() => ({
        imgs,
        setImgs,
        step,
        setStep,
        selectedImg,
        setSelectedImg,
        functions,
        addFunction,
        editFunction
    }), [imgs, step, selectedImg, functions]);

    return (
        <WorkSessionContext.Provider value={contextValue}>
            {children}
        </WorkSessionContext.Provider>
    );
}

export function useWorkSession(): WorkSessionContextProps {
    const context = useContext(WorkSessionContext);
    if (!context) {
        throw new Error("useWorkSession must be used within a WorkSessionProvider");
    }
    return context;
}
