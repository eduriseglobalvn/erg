"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Skeleton } from "@/components/admin/ui/skeleton"

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
import { analyticsApi, VisitorStat } from "@/services/analytics.api"

const chartConfig = {
    visitors: {
        label: "Total Visitors",
    },
    desktop: {
        label: "Desktop",
        color: "#2563eb",
    },
    mobile: {
        label: "Mobile",
        color: "#60a5fa",
    },
} satisfies ChartConfig

const timeRangeLabels = {
    "90d": "last 3 months",
    "30d": "last 30 days",
    "7d": "last 7 days"
} as const

export function VisitorsChart() {
    const [timeRange, setTimeRange] = React.useState<"90d" | "30d" | "7d">("90d")

    const { data: chartData = [], isLoading } = useQuery({
        queryKey: ['analytics', 'visitors', timeRange],
        queryFn: async () => {
            const res = await analyticsApi.getStats(timeRange)
            return res.data || []
        }
    })


    return (
        <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="space-y-1">
                    <CardTitle className="text-base font-semibold">Total Visitors</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                        Total for the {timeRangeLabels[timeRange]}
                    </CardDescription>
                </div>

                {/* Tab-style Time Range Selector */}
                <div className="flex items-center gap-1 rounded-lg border bg-background p-1">
                    <button
                        onClick={() => setTimeRange("90d")}
                        className={`
                            rounded-md px-3 py-1.5 text-sm font-medium transition-all
                            ${timeRange === "90d"
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }
                        `}
                    >
                        Last 3 months
                    </button>
                    <button
                        onClick={() => setTimeRange("30d")}
                        className={`
                            rounded-md px-3 py-1.5 text-sm font-medium transition-all
                            ${timeRange === "30d"
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }
                        `}
                    >
                        Last 30 days
                    </button>
                    <button
                        onClick={() => setTimeRange("7d")}
                        className={`
                            rounded-md px-3 py-1.5 text-sm font-medium transition-all
                            ${timeRange === "7d"
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }
                        `}
                    >
                        Last 7 days
                    </button>
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                {isLoading ? (
                    <div className="flex flex-col space-y-3 h-[300px]">
                        <Skeleton className="h-[250px] w-full rounded-xl" />
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-4 w-[100px]" />
                        </div>
                    </div>
                ) : (
                    <ChartContainer
                        config={chartConfig}
                        className="aspect-auto h-[300px] w-full"
                    >
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor="var(--color-desktop)"
                                        stopOpacity={0.3}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="var(--color-desktop)"
                                        stopOpacity={0.05}
                                    />
                                </linearGradient>
                                <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor="var(--color-mobile)"
                                        stopOpacity={0.3}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="var(--color-mobile)"
                                        stopOpacity={0.05}
                                    />
                                </linearGradient>
                            </defs>

                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="hsl(var(--border))"
                                opacity={0.3}
                            />

                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                                minTickGap={32}
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value) => {
                                    const date = new Date(value)
                                    return date.toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                    })
                                }}
                            />

                            <ChartTooltip
                                cursor={{ strokeDasharray: '3 3' }}
                                content={
                                    <ChartTooltipContent
                                        labelFormatter={(value) => {
                                            return new Date(value).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric"
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
                )}
            </CardContent>
        </Card>
    )
}
