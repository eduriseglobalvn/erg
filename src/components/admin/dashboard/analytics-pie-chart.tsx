"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"
import { analyticsApi } from "@/services/analytics.api"

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

// Statics removed, will be dynamic from useQuery analytics


const chartConfig = {
    count: {
        label: "Bài viết",
    },
    "Tin Giáo dục": {
        label: "Tin Giáo dục",
        color: "#2563eb",
    },
    "Mẹo & Thủ thuật": {
        label: "Mẹo & Thủ thuật",
        color: "#60a5fa",
    },
    "Hoạt động": {
        label: "Hoạt động",
        color: "#3b82f6",
    },
    "Tuyển dụng": {
        label: "Tuyển dụng",
        color: "#93c5fd",
    },
    "Khác": {
        label: "Khác",
        color: "#dbeafe",
    },
} satisfies ChartConfig

export function AnalyticsPieChart() {
    const { data: summaryData } = useQuery({
        queryKey: ['analytics', 'posts', 'summary', '90d'],
        queryFn: () => analyticsApi.getPostSummary('90d').then(res => res.data)
    })

    const chartData = React.useMemo(() => {
        const data = summaryData?.categoryDistribution || [];
        const colors = ["#2563eb", "#60a5fa", "#3b82f6", "#93c5fd", "#dbeafe"];
        return data.map((item, idx) => ({
            ...item,
            fill: colors[idx % colors.length]
        }));
    }, [summaryData])

    const totalPosts = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.count, 0)
    }, [chartData])



    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Phân bổ theo danh mục</CardTitle>
                <CardDescription>Tháng 1 - Tháng 6 2026</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[280px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="count"
                            nameKey="category"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalPosts.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Bài viết
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Tăng 5.2% so với tháng trước <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Hiển thị phân bổ bài viết theo danh mục
                </div>
            </CardFooter>
        </Card>
    )
}
