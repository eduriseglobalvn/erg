"use client"

import * as React from "react"
// --- SỬA DÒNG NÀY: Bỏ defs, linearGradient, stop ---
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/admin/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/admin/ui/chart"
import { VISITORS_DATA } from "@/mocks/chart-data"

const chartConfig = {
    visitors: {
        label: "Total Visitors",
    },
    desktop: {
        label: "Desktop",
        color: "#2563eb", // Blue-600
    },
    mobile: {
        label: "Mobile",
        color: "#60a5fa", // Blue-400
    },
} satisfies ChartConfig

export function VisitorsChart() {
    const [timeRange, setTimeRange] = React.useState("90d")

    const filteredData = VISITORS_DATA.filter((item) => {
        const date = new Date(item.date)
        const now = new Date()
        let daysToSubtract = 90

        if (timeRange === "30d") {
            daysToSubtract = 30
        } else if (timeRange === "7d") {
            daysToSubtract = 7
        }

        const startDate = new Date(now)
        startDate.setDate(now.getDate() - daysToSubtract)

        return date >= startDate
    })

    return (
        <Card className="col-span-4 border-none shadow-sm">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1">
                    <CardTitle>Total Visitors</CardTitle>
                    <CardDescription>
                        Total for the last 3 months
                    </CardDescription>
                </div>

                {/* Tab Switcher */}
                <div className="flex items-center rounded-lg border bg-muted/50 p-1 text-muted-foreground sm:ml-auto">
                    {["90d", "30d", "7d"].map((range) => {
                        const label = range === "90d" ? "Last 3 months" : range === "30d" ? "Last 30 days" : "Last 7 days"
                        const isActive = timeRange === range
                        return (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`
                            rounded-md px-3 py-1 text-sm font-medium transition-all
                            ${isActive
                                    ? "bg-background text-foreground shadow-sm"
                                    : "hover:text-foreground hover:bg-background/50"
                                }
                        `}
                            >
                                {label}
                            </button>
                        )
                    })}
                </div>
            </CardHeader>

            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[350px] w-full"
                >
                    <AreaChart data={filteredData}>
                        {/* Các thẻ này là SVG native, viết thường và không cần import */}
                        <defs>
                            <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-desktop)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-desktop)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-mobile)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-mobile)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>

                        <CartesianGrid vertical={false} />

                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />

                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })
                                    }}
                                    indicator="dot"
                                />
                            }
                        />

                        <Area
                            dataKey="mobile"
                            type="monotone"
                            fill="url(#fillMobile)"
                            stroke="var(--color-mobile)"
                            strokeWidth={2}
                            stackId="a"
                        />

                        <Area
                            dataKey="desktop"
                            type="monotone"
                            fill="url(#fillDesktop)"
                            stroke="var(--color-desktop)"
                            strokeWidth={2}
                            stackId="a"
                        />

                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}