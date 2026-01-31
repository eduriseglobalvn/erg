"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import * as React from "react"
import { setGlobalQueryClient } from "@/lib/logout-utils"

export function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = React.useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000, // 1 minute default
                        gcTime: 5 * 60 * 1000, // 5 minutes garbage collection
                        refetchOnWindowFocus: true, // Auto refetch khi focus window
                        refetchOnReconnect: true, // Auto refetch khi reconnect
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
            {children}
            {/* Only show DevTools in development */}
            {process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools
                    initialIsOpen={false}
                />
            )}
        </QueryClientProvider>
    )
}
