import { useState, useEffect, useCallback, useRef } from 'react';

export function useWebSocket(url: string | null) {
    const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);
    const [readyState, setReadyState] = useState<number>(WebSocket.CLOSED);
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!url) return;

        const ws = new WebSocket(url);
        wsRef.current = ws;
        setReadyState(WebSocket.CONNECTING);

        ws.onopen = () => setReadyState(WebSocket.OPEN);
        ws.onclose = () => setReadyState(WebSocket.CLOSED);
        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
        ws.onmessage = (event) => {
            setLastMessage(event);
        };

        return () => {
            ws.close();
            wsRef.current = null;
        };
    }, [url]);

    const sendMessage = useCallback((data: any) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(typeof data === 'string' ? data : JSON.stringify(data));
        }
    }, []);

    return { sendMessage, lastMessage, readyState };
}
