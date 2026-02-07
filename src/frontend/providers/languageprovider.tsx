'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'

interface LanguageContextProps {
    language: string;
    handleSetLanguge: VoidFunction;
}

export const LanguageContext = createContext<LanguageContextProps | null>(null);

export function LangugeProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [language, setLanguage] = useState("hu-HU");
    const handleSetLanguge = useCallback(() => setLanguage((prev) => prev === "hu-HU" ? "en-EN" : "hu-HU"), []);

    const contextValue = useMemo<LanguageContextProps>(
        () => ({ language, handleSetLanguge }),
        [language, handleSetLanguge]
    );

    return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a StateContextProvider");
    }
    return context;
}