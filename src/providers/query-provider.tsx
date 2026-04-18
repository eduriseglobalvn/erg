"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import * as React from "react"
import { setGlobalQueryClient } from "@/lib/logout-utils"
import { FirebaseAnalyticsProvider } from "@/providers/FirebaseAnalyticsProvider"

export function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = React.useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000, // 1 minute default
                        gcTime: 5 * 60 * 1000, // 5 minutes garbage collection
                        refetchOnWindowFocus: false, // Tắt auto refetch khi focus window (tránh network storm)
                        refetchOnReconnect: false, // Tắt auto refetch khi reconnect
                        retry: 1, // Retry 1 lần nếu fail
                    },
                    mutations: {
                        retry: 0, // Không retry mutations
                    },
                },
            })
    )

    // Expose queryClient globally for logout
    React.useEffect(() => {
        setGlobalQueryClient(queryClient);
    }, [queryClient]);

    return (
        <QueryClientProvider client={queryClient}>
            <FirebaseAnalyticsProvider>
                {children}
            </FirebaseAnalyticsProvider>
        </QueryClientProvider>
    )
}
