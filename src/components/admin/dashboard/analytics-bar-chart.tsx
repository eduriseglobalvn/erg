"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/admin/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/admin/ui/chart"
import { analyticsApi } from "@/services/analytics.api"

const chartConfig = {
    posts: {
        label: "Bài viết",
        color: "#2563eb",
    },
    views: {
        label: "Lượt xem (Est)",
        color: "#60a5fa",
    },
} satisfies ChartConfig

export function AnalyticsBarChart() {
    const { data: summaryData, isLoading } = useQuery({
        queryKey: ['analytics', 'posts', 'summary', '90d'],
        queryFn: () => analyticsApi.getPostSummary('90d').then(res => res.data)
    })

    const chartData = summaryData?.monthlyStats || []


    return (
        <Card>
            <CardHeader>
                <CardTitle>Thống kê bài viết</CardTitle>
                <CardDescription>Tháng 1 - Tháng 6 2026</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[280px] w-full">
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 7)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar dataKey="posts" fill="var(--color-posts)" radius={4} />
                        <Bar dataKey="views" fill="var(--color-views)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    Tăng 5.2% so với tháng trước <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Hiển thị tổng số bài viết và lượt xem trong 6 tháng gần nhất
                </div>
            </CardFooter>
        </Card>
    )
}
