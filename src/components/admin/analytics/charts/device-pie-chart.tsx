"use client"

/**
 * Pie Chart: Device Types (mobile / desktop / tablet)
 * Dùng dữ liệu từ GET /api/insight/overview → devices.types
 */

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { useQuery } from "@tanstack/react-query"
import { analyticsApi } from "@/services/analytics.api"
import { Skeleton } from "@/components/admin/ui/skeleton"

const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
]

const mockDevices = [
    { name: "Mobile", value: 58 },
    { name: "Desktop", value: 37 },
    { name: "Tablet", value: 5 },
]

export function DevicePieChart() {
    const { data, isLoading } = useQuery({
        queryKey: ['analytics', 'overview'],
        queryFn: async () => {
            const res = await analyticsApi.getOverview()
            return 'data' in res ? (res as any).data?.devices?.types ?? mockDevices : res?.devices?.types ?? mockDevices
        },
        retry: 1,
    })

    const chartData = Array.isArray(data) && data.length > 0
        ? data.map((d: any) => ({ name: d.name || d.category, value: d.count || d.value }))
        : mockDevices

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
                    outerRadius={80}
                    innerRadius={45}
                    paddingAngle={2}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                >
                    {chartData.map((_: any, index: number) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
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
