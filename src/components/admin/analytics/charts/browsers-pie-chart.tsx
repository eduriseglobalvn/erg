"use client"

/**
 * Pie Chart: Browsers (Chrome / Safari / Firefox / Edge / Others)
 * Dùng dữ liệu từ GET /api/insight/overview → devices.browsers
 */

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { useQuery } from "@tanstack/react-query"
import { analyticsApi } from "@/services/analytics.api"
import { Skeleton } from "@/components/admin/ui/skeleton"

const BROWSER_COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
]

const mockBrowsers = [
    { name: "Chrome", value: 62 },
    { name: "Safari", value: 22 },
    { name: "Firefox", value: 8 },
    { name: "Edge", value: 5 },
    { name: "Khác", value: 3 },
]

export function BrowsersPieChart() {
    const { data, isLoading } = useQuery({
        queryKey: ['analytics', 'overview'],
        queryFn: async () => {
            const res = await analyticsApi.getOverview()
            return 'data' in res ? (res as any).data?.devices?.browsers ?? mockBrowsers : res?.devices?.browsers ?? mockBrowsers
        },
        retry: 1,
    })

    const chartData = Array.isArray(data) && data.length > 0
        ? data.map((d: any) => ({ name: d.name || d.category, value: d.count || d.percentage || d.value }))
        : mockBrowsers

    if (isLoading) return <Skeleton className="h-[220px] w-full rounded-xl" />

    if (chartData.length === 0) {
        return <div className="flex items-center justify-center h-[220px] text-muted-foreground text-sm">Chưa có dữ liệu</div>
    }

    return (
        <ResponsiveContainer width="100%" height={220}>
            <PieChart>
                <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    innerRadius={40}
                    paddingAngle={2}
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                >
                    {chartData.map((_: any, index: number) => (
                        <Cell key={index} fill={BROWSER_COLORS[index % BROWSER_COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                    }}
                    formatter={(value: number) => [`${value}%`, "Tỷ lệ"]}
                />
            </PieChart>
        </ResponsiveContainer>
    )
}
