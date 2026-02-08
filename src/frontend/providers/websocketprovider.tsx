'use client'

import { createContext, RefObject, useContext, useEffect, useMemo, useRef } from 'react'

interface WebsocketContextProps {
    ws: RefObject<WebSocket | null>
}

export const WebsocketContext = createContext<WebsocketContextProps | null>(null)

export function WebsocketProvider({ children }: { children: React.ReactNode }) {
    const wsRef = useRef<WebSocket | null>(null);
    const mounted = useRef(false);

    useEffect(() => {
        if (mounted.current) return;
        mounted.current = true

        const socket = new WebSocket("ws://localhost:8000/ws/");
        wsRef.current = socket;

        socket.addEventListener("open", () => {
            wsRef.current?.send(JSON.stringify({ message: 'connect' }));
        });

        socket.addEventListener("error", (event) => {
            wsRef.current?.send(JSON.stringify({ message: 'error', data: event }));
        });

        socket.addEventListener("close", () => {
            wsRef.current?.send(JSON.stringify({ message: 'close' }));
        });

    }, [])

    const contextValue = useMemo<WebsocketContextProps>(
        () => ({ ws: wsRef }),
        []
    )

    return (
        <WebsocketContext.Provider value={contextValue}>
            {children}
        </WebsocketContext.Provider>
    )
}

export function useWebsocket() {
    const context = useContext(WebsocketContext)
    if (!context) {
        throw new Error(
            'useWebsocket must be used within a WebsocketContext.Provider'
        )
    }
    return context
}
