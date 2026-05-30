"use client"

/**
 * Bar Chart: Peak Hours (0-23h)
 * Dùng dữ liệu từ GET /api/insight/overview → peakHours
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useQuery } from "@tanstack/react-query"
import { analyticsApi } from "@/services/analytics.api"
import { Skeleton } from "@/components/cms/ui/skeleton"

const mockPeakHours = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    count: i >= 8 && i <= 22 ? Math.floor(Math.random() * 300) + 50 : Math.floor(Math.random() * 80) + 10,
}))

export function PeakHoursChart() {
    const { data, isLoading } = useQuery({
        queryKey: ['analytics', 'overview'],
        queryFn: async () => {
            const res = await analyticsApi.getOverview()
            return 'data' in res ? (res as any).data?.peakHours ?? mockPeakHours : res?.peakHours ?? mockPeakHours
        },
        retry: 1,
    })

    const chartData = Array.isArray(data) && data.length > 0
        ? data.map((d: any) => ({ hour: d.hour, count: d.count }))
        : mockPeakHours

    if (isLoading) return <Skeleton className="h-[180px] w-full rounded-xl" />

    if (chartData.length === 0) {
        return <div className="flex items-center justify-center h-[180px] text-muted-foreground text-sm">Chưa có dữ liệu</div>
    }

    return (
        <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis
                    dataKey="hour"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10 }}
                    tickFormatter={(v: number) => `${v}h`}
                    interval={3}
                />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                    }}
                    formatter={(value: number) => [value.toLocaleString(), "Lượt truy cập"]}
                    labelFormatter={(h: number) => `${h}:00 - ${h}:59`}
                />
                <Bar dataKey="count" fill="hsl(var(--chart-4))" radius={[2, 2, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    )
}
