"use client"

/**
 * Time Range Picker cho Analytics Dashboard
 * Cho phép chọn khoảng thời gian: 7 ngày, 30 ngày, 90 ngày
 */

import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/cms/ui/button"
import { cn } from "@/lib/utils"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useCallback } from "react"

const TIME_RANGES = [
    { label: "7 ngày", value: "7d" },
    { label: "30 ngày", value: "30d" },
    { label: "90 ngày", value: "90d" },
] as const

type TimeRange = (typeof TIME_RANGES)[number]["value"]

export function AnalyticsTimeRangePicker() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const queryClient = useQueryClient()

    // Lấy range từ URL, default "30d"
    const currentRange = (searchParams.get("range") as TimeRange) || "30d"

    const handleRangeChange = useCallback((range: TimeRange) => {
        // Update URL param
        const params = new URLSearchParams(searchParams.toString())
        params.set("range", range)
        router.push(`${pathname}?${params.toString()}`, { scroll: false })

        // Invalidate cache để charts reload data mới
        queryClient.invalidateQueries({ queryKey: ["analytics"] })
    }, [router, pathname, searchParams, queryClient])

    return (
        <div className="flex items-center gap-1 rounded-lg border bg-background p-1">
            {TIME_RANGES.map((item) => (
                <Button
                    key={item.value}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRangeChange(item.value)}
                    className={cn(
                        "h-7 text-xs font-medium transition-all",
                        currentRange === item.value
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    {item.label}
                </Button>
            ))}
        </div>
    )
}
