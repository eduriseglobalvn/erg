"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
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
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/admin/ui/chart"
import type { AIKey } from "@/services/ai.api"

const COLORS = [
    "#8b5cf6", // Purple
    "#3b82f6", // Blue
    "#10b981", // Emerald
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#ec4899", // Pink
    "#06b6d4", // Cyan
]

export function AIKeysChart({ keys }: { keys: AIKey[] }) {
    // Determine chart config based on keys - Stable colors
    const keyColors = React.useMemo(() => {
        const map: Record<string, string> = {}
        keys.forEach((k, i) => {
            map[k.id] = COLORS[i % COLORS.length]
        })
        return map
    }, [keys])

    const chartConfig = React.useMemo(() => {
        const config: ChartConfig = {}
        keys.forEach((k) => {
            const keyId = `key_${k.id.replace(/-/g, '_')}`
            config[keyId] = {
                label: k.label || `Key ${k.key.substring(k.key.length - 4)}`,
                color: keyColors[k.id]
            }
        })
        return config
    }, [keys, keyColors])

    // Generate simulated time-series data
    const chartData = React.useMemo(() => {
        if (keys.length === 0) return []

        const hours = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "Hiện tại"]
        return hours.map((hour, hIndex) => {
            const dataPoint: any = { time: hour }
            keys.forEach((k) => {
                const keyId = `key_${k.id.replace(/-/g, '_')}`
                if (hour === "Hiện tại") {
                    dataPoint[keyId] = k.todayUsage
                } else {
                    const ratio = hIndex / (hours.length - 1)
                    dataPoint[keyId] = Math.floor(k.todayUsage * ratio * (0.7 + Math.random() * 0.3))
                }
            })
            return dataPoint
        })
    }, [keys])

    // Sort areas to put keys with values on top of 0-value keys
    // In Recharts, the last rendered Area is on top.
    const sortedKeysForRendering = React.useMemo(() => {
        return [...keys].sort((a, b) => a.todayUsage - b.todayUsage)
    }, [keys])

    if (keys.length === 0) return null

    return (
        <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-primary">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    Theo dõi lưu lượng API (Usage Metrics)
                </CardTitle>
                <CardDescription>
                    So sánh mức độ hoạt động và hạn mức sử dụng giữa các API Keys trong ngày
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full">
                    <AreaChart
                        data={chartData}
                        margin={{ left: -10, right: 10, top: 10, bottom: 0 }}
                    >
                        <defs>
                            {keys.map((k) => {
                                const keyId = `key_${k.id.replace(/-/g, '_')}`
                                const color = keyColors[k.id]
                                return (
                                    <linearGradient key={keyId} id={`fill_${keyId}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                                    </linearGradient>
                                )
                            })}
                        </defs>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.2} />
                        <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            tickMargin={10}
                            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                            allowDecimals={false}
                        />
                        <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />

                        {keys.map((k) => {
                            const keyId = `key_${k.id.replace(/-/g, '_')}`
                            const color = keyColors[k.id]
                            return (
                                <Area
                                    key={keyId}
                                    type="monotone"
                                    dataKey={keyId}
                                    stroke={color}
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill={`url(#fill_${keyId})`}
                                    activeDot={{ r: 5, strokeWidth: 0 }}
                                    animationDuration={1500}
                                />
                            )
                        })}
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
