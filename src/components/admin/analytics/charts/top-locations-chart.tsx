"use client"

/**
 * Horizontal Bar Chart: Top Locations (city / country)
 * Dùng dữ liệu từ GET /api/insight/overview → locations
 */

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { useQuery } from "@tanstack/react-query"
import { analyticsApi } from "@/services/analytics.api"
import { Skeleton } from "@/components/admin/ui/skeleton"

const LOCATION_COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
]

const mockLocations = [
    { city: "TP. Hồ Chí Minh", country: "Việt Nam", count: 18500 },
    { city: "Hà Nội", country: "Việt Nam", count: 12300 },
    { city: "Đà Nẵng", country: "Việt Nam", count: 4200 },
    { city: "Cần Thơ", country: "Việt Nam", count: 2100 },
    { city: "Hải Phòng", country: "Việt Nam", count: 1800 },
]

export function TopLocationsChart() {
    const { data, isLoading } = useQuery({
        queryKey: ['analytics', 'overview'],
        queryFn: async () => {
            const res = await analyticsApi.getOverview()
            return 'data' in res ? (res as any).data?.locations ?? mockLocations : res?.locations ?? mockLocations
        },
        retry: 1,
    })

    const chartData = Array.isArray(data) && data.length > 0
        ? data.slice(0, 8).map((d: any) => ({
            name: d.city || d.name || "Unknown",
            count: d.count || d.value,
        }))
        : mockLocations.slice(0, 8).map(d => ({ name: d.city, count: d.count }))

    if (isLoading) return <Skeleton className="h-[220px] w-full rounded-xl" />

    if (chartData.length === 0) {
        return <div className="flex items-center justify-center h-[220px] text-muted-foreground text-sm">Chưa có dữ liệu</div>
    }

    return (
        <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <YAxis
                    type="category"
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11 }}
                    width={120}
                    tickFormatter={(v) => String(v).length > 15 ? String(v).substring(0, 15) + "…" : String(v)}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                    }}
                    formatter={(value: number) => [value.toLocaleString(), "Lượt truy cập"]}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {chartData.map((_: any, index: number) => (
                        <Cell key={index} fill={LOCATION_COLORS[index % LOCATION_COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    )
}
