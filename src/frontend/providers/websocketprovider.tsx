'use client'

import { createContext, RefObject, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

interface WebscoketContextProps {
    ws: RefObject<WebSocket | null>;
}

export const WebsocketContext = createContext<WebscoketContextProps | null>(null);

export function WebsocketProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const wsRef = useRef<WebSocket | null>(null)

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8000/ws/')
        socket.binaryType = "arraybuffer";
        
        wsRef.current = socket;

        wsRef.current.addEventListener("open", () => {
            socket.send(JSON.stringify({
                "message" : "connected",
            }));
        });
    }, []);

    const contextValue = useMemo<WebscoketContextProps>(
        () => ({ ws: wsRef }),
        [wsRef]
    );

    return <WebsocketContext.Provider value={contextValue}>{children}</WebsocketContext.Provider>
}

export function useWebsocket() {
    const context = useContext(WebsocketContext);
    if (!context) {
        throw new Error("useWebsocket must be used within a WebsocketContext.Provider");
    }
    return context;
}