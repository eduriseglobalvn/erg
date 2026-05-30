"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useSeoQueryPerformance } from "@/hooks/use-seo"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/cms/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/cms/ui/chart"
import { Skeleton } from "@/components/cms/ui/skeleton"

const chartConfig = {
    clicks: {
        label: "Clicks",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export function SeoTopQueriesChart() {
    const { data: queries, isLoading, isError } = useSeoQueryPerformance(15)

    if (isLoading) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <Skeleton className="h-6 w-[200px] mb-2" />
                    <Skeleton className="h-4 w-[150px]" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[300px] w-full" />
                </CardContent>
            </Card>
        )
    }

    if (isError || !queries) return null

    // Transform data for horizontal bar chart
    // Recharts horizontal bar chart: YAxis exhibits the category, XAxis exhibits the value
    const data = Array.isArray(queries) ? queries : (queries as any).data || [];
    const chartData = Array.isArray(data) ? data.slice(0, 15).reverse() : [];

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Top Keywords</CardTitle>
                <CardDescription>Các từ khóa dẫn đầu về lượt nhấp chuột</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{
                            left: 40,
                        }}
                    >
                        <CartesianGrid horizontal={false} />
                        <YAxis
                            dataKey="query"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            width={100}
                            style={{ fontSize: '10px', fontWeight: 'bold' }}
                            tickFormatter={(value) =>
                                value.length > 15 ? `${value.substring(0, 15)}...` : value
                            }
                        />
                        <XAxis type="number" hide />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Bar
                            dataKey="clicks"
                            fill="var(--color-clicks)"
                            radius={5}
                            layout="vertical"
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
