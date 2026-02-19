"use client"

import { useSeoPerformance } from "@/hooks/use-seo"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Skeleton } from "@/components/admin/ui/skeleton"
import { MousePointer2, Eye, BarChart as BarChartIcon, Target, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function SeoStatsCards() {
    const { data: performance, isLoading, isError } = useSeoPerformance('month')

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-4 w-4 rounded-full" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-[80px] mb-1" />
                            <Skeleton className="h-3 w-[120px]" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    if (isError || !performance) return null

    const overview = performance?.overview || {
        totalClicks: 0,
        totalImpressions: 0,
        avgCtr: 0,
        avgPosition: 0
    }

    const stats = [
        {
            title: "Total Clicks",
            value: overview.totalClicks.toLocaleString(),
            icon: MousePointer2,
            description: "Số lần nhấp từ Google",
            color: "text-blue-500",
        },
        {
            title: "Total Impressions",
            value: overview.totalImpressions.toLocaleString(),
            icon: Eye,
            description: "Số lần hiển thị tìm kiếm",
            color: "text-purple-500",
        },
        {
            title: "Avg. CTR",
            value: `${(overview.avgCtr * 100).toFixed(1)}%`,
            icon: Target,
            description: "Tỷ lệ nhấp chuột trung bình",
            color: overview.avgCtr < 0.01 ? "text-red-500" : "text-green-500",
            alert: overview.avgCtr < 0.01 ? "CTR thấp cần tối ưu Meta!" : null
        },
        {
            title: "Avg. Position",
            value: overview.avgPosition.toFixed(1),
            icon: BarChartIcon,
            description: "Vị trí hạng trung bình",
            color: "text-orange-500",
        }
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
                <Card key={i} className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                        <stat.icon className={cn("h-4 w-4", stat.color)} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                        {stat.alert && (
                            <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-red-500 animate-pulse">
                                <AlertCircle className="w-3 h-3" />
                                {stat.alert}
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
