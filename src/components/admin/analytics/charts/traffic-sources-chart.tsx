"use client"

/**
 * Bar Chart: Traffic Sources (direct / google / facebook / others)
 * Dùng dữ liệu từ GET /api/insight/overview → trafficSources
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { useQuery } from "@tanstack/react-query"
import { analyticsApi } from "@/services/analytics.api"
import { Skeleton } from "@/components/admin/ui/skeleton"

const SOURCE_COLORS: Record<string, string> = {
    "Direct": "hsl(var(--chart-1))",
    "Google": "hsl(var(--chart-2))",
    "Facebook": "hsl(var(--chart-3))",
    "default": "hsl(var(--chart-4))",
}

const mockSources = [
    { source: "Direct", count: 14500 },
    { source: "Google", count: 8200 },
    { source: "Facebook", count: 3400 },
    { source: "Other", count: 1900 },
]

export function TrafficSourcesChart() {
    const { data, isLoading } = useQuery({
        queryKey: ['analytics', 'overview'],
        queryFn: async () => {
            const res = await analyticsApi.getOverview()
            return 'data' in res ? (res as any).data?.trafficSources ?? mockSources : res?.trafficSources ?? mockSources
        },
        retry: 1,
    })

    const chartData = Array.isArray(data) && data.length > 0
        ? data.map((d: any) => ({ source: d.source || d.name, count: d.count || d.value }))
        : mockSources

    if (isLoading) return <Skeleton className="h-[220px] w-full rounded-xl" />

    if (chartData.length === 0) {
        return <div className="flex items-center justify-center h-[220px] text-muted-foreground text-sm">Chưa có dữ liệu</div>
    }

    return (
        <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="source" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                    }}
                    formatter={(value: number) => [value.toLocaleString(), "Lượt truy cập"]}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry: any, index: number) => (
                        <Cell
                            key={index}
                            fill={SOURCE_COLORS[entry.source] || SOURCE_COLORS["default"]}
                        />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    )
}
