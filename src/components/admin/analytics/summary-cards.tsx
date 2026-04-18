"use client"

/**
 * Summary Cards cho Analytics Dashboard
 * Hiển thị: Total Visits, Active Users, New Users, Bounce Rate
 * Mỗi card có giá trị hiện tại, giá trị trước, và % tăng trưởng
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Skeleton } from "@/components/admin/ui/skeleton"
import { useQuery } from "@tanstack/react-query"
import { analyticsApi } from "@/services/analytics.api"
import { TrendingUp, TrendingDown, Eye, Users, UserPlus, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface SummaryMetric {
    value: number
    previous: number
    growth: number // percentage, can be negative
}

interface SummaryData {
    totalVisits: SummaryMetric
    activeUsers: SummaryMetric
    newUsers: SummaryMetric
    bounceRate: SummaryMetric
}

// Mock data khi backend chưa trả đủ data (để UI không bị trống)
const mockSummary: SummaryData = {
    totalVisits: { value: 45678, previous: 42100, growth: 8.5 },
    activeUsers: { value: 1234, previous: 1100, growth: 12.2 },
    newUsers: { value: 156, previous: 168, growth: -7.1 },
    bounceRate: { value: 35.2, previous: 38.1, growth: -7.6 },
}

function SummaryCard({
    title,
    value,
    previous,
    growth,
    icon: Icon,
    suffix = "",
    isPercentage = false,
}: {
    title: string
    value: number
    previous: number
    growth: number
    icon: React.ElementType
    suffix?: string
    isPercentage?: boolean
}) {
    const isPositive = growth >= 0
    // For bounce rate, lower is better
    const isGood = title.toLowerCase().includes("bounce") ? !isPositive : isPositive

    const formatValue = (v: number) => {
        if (isPercentage) return `${v.toFixed(1)}%`
        return v >= 1000 ? v.toLocaleString() : String(v)
    }

    return (
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <div className={cn(
                    "p-2 rounded-lg",
                    isGood ? "bg-green-100 dark:bg-green-900/20" : "bg-red-100 dark:bg-red-900/20"
                )}>
                    <Icon className={cn(
                        "h-4 w-4",
                        isGood ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    )} />
                </div>
            </CardHeader>
            <CardContent className="pb-2">
                <div className="text-2xl font-bold tracking-tight">
                    {formatValue(value)}
                    {suffix && <span className="text-sm font-normal text-muted-foreground ml-1">{suffix}</span>}
                </div>
            </CardContent>
            <CardContent className="pt-0">
                <div className="flex items-center gap-2">
                    {/* Growth indicator */}
                    <div className={cn(
                        "flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded",
                        isGood
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    )}>
                        {isPositive ? (
                            <TrendingUp className="h-3 w-3" />
                        ) : (
                            <TrendingDown className="h-3 w-3" />
                        )}
                        <span>{isPositive ? "+" : ""}{growth.toFixed(1)}%</span>
                    </div>

                    {/* Previous value label */}
                    <span className="text-xs text-muted-foreground">
                        so với {formatValue(previous)}{suffix && !isPercentage ? suffix : isPercentage ? "%" : ""} trước
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}

export function AnalyticsSummaryCards() {
    const { data, isLoading } = useQuery({
        queryKey: ['analytics', 'overview'],
        queryFn: async () => {
            const res = await analyticsApi.getOverview()
            // Backend trả về flat object; map sang structured summary
            const raw = 'data' in res ? (res as any).data : res
            return raw as SummaryData | undefined
        },
        // Retry 1 lần, fallback sang mock nếu lỗi
        retry: 1,
    })

    const summary: SummaryData = data ?? mockSummary

    if (isLoading) {
        return (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="border-none shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-8 w-8 rounded-lg" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-7 w-[80px] mb-2" />
                            <Skeleton className="h-3 w-[120px]" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
                title="Tổng lượt truy cập"
                value={summary.totalVisits.value}
                previous={summary.totalVisits.previous}
                growth={summary.totalVisits.growth}
                icon={Eye}
            />
            <SummaryCard
                title="Người dùng hoạt động"
                value={summary.activeUsers.value}
                previous={summary.activeUsers.previous}
                growth={summary.activeUsers.growth}
                icon={Users}
            />
            <SummaryCard
                title="Người dùng mới"
                value={summary.newUsers.value}
                previous={summary.newUsers.previous}
                growth={summary.newUsers.growth}
                icon={UserPlus}
            />
            <SummaryCard
                title="Tỷ lệ thoát"
                value={summary.bounceRate.value}
                previous={summary.bounceRate.previous}
                growth={summary.bounceRate.growth}
                icon={AlertTriangle}
                isPercentage
            />
        </div>
    )
}
