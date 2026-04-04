"use client"

/**
 * Area Chart: Traffic over time (mobile vs desktop)
 * Dùng dữ liệu từ GET /api/insight/stats
 */

import { useQuery } from "@tanstack/react-query"
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { analyticsApi } from "@/services/analytics.api"
import { Skeleton } from "@/components/admin/ui/skeleton"

const CHART_CONFIG = {
    desktop: { label: "Desktop", color: "hsl(var(--chart-1))" },
    mobile: { label: "Mobile", color: "hsl(var(--chart-2))" },
}

export function TrafficAreaChart() {
    const { data: chartData = [], isLoading } = useQuery({
        queryKey: ['analytics', 'visitors', 'traffic'],
        queryFn: () => analyticsApi.getStats("90d").then(res => res.data || []),
        retry: 1,
    })

    return (
        <Card className="border-none shadow-sm">
            <CardHeader>
                <CardTitle className="text-base font-semibold">Lượt truy cập theo thời gian</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                    Desktop vs Mobile — 90 ngày gần nhất
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <Skeleton className="h-[300px] w-full rounded-xl" />
                ) : chartData.length === 0 ? (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">
                        Chưa có dữ liệu lượt truy cập
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                            <defs>
                                <linearGradient id="gradDesktop" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.05} />
                                </linearGradient>
                                <linearGradient id="gradMobile" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.05} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.3} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                                tick={{ fontSize: 12 }}
                                tickFormatter={(v: string) => {
                                    const d = new Date(v)
                                    return d.toLocaleDateString("vi-VN", { month: "short", day: "numeric" })
                                }}
                            />
                            <YAxis tickLine={false} axisLine={false} tickMargin={10} tick={{ fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--background))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "8px",
                                    fontSize: "12px",
                                }}
                                labelFormatter={(v: string) => new Date(v).toLocaleDateString("vi-VN", { year: "numeric", month: "long", day: "numeric" })}
                            />
                            <Legend />
                            <Area
                                type="monotone"
                                dataKey="desktop"
                                stroke="var(--color-desktop)"
                                fill="url(#gradDesktop)"
                                strokeWidth={2}
                                name="Desktop"
                            />
                            <Area
                                type="monotone"
                                dataKey="mobile"
                                stroke="var(--color-mobile)"
                                fill="url(#gradMobile)"
                                strokeWidth={2}
                                name="Mobile"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    )
}
