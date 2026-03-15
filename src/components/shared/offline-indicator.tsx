"use client"

import { useState, useEffect } from "react"
import { WifiOff } from "lucide-react"

export function OfflineIndicator() {
    const [isOffline, setIsOffline] = useState(false)

    useEffect(() => {
        // Check initial state
        if (typeof navigator !== "undefined") {
            setIsOffline(!navigator.onLine)
        }

        const handleOnline = () => setIsOffline(false)
        const handleOffline = () => setIsOffline(true)

        window.addEventListener("online", handleOnline)
        window.addEventListener("offline", handleOffline)

        return () => {
            window.removeEventListener("online", handleOnline)
            window.removeEventListener("offline", handleOffline)
        }
    }, [])

    if (!isOffline) return null

    return (
        <div className="fixed bottom-4 left-4 z-50 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
                <WifiOff className="w-5 h-5" />
                <div>
                    <p className="font-bold text-sm">Mất kết nối mạng</p>
                    <p className="text-xs opacity-90">Vui lòng kiểm tra lại kết nối internet của bạn.</p>
                </div>
            </div>
        </div>
    )
}
