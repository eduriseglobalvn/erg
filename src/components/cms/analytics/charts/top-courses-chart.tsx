"use client"

/**
 * Horizontal Bar Chart: Top Courses
 * Dùng dữ liệu từ GET /api/insight/overview → content.topCourses
 */

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { useQuery } from "@tanstack/react-query"
import { analyticsApi } from "@/services/analytics.api"
import { Skeleton } from "@/components/cms/ui/skeleton"

const mockCourses = [
    { title: "Toán Kangaroo Lớp 1-5", views: 8500 },
    { title: "Tiếng Anh Giao tiếp A1-C2", views: 7200 },
    { title: "Lập trình Python Cơ bản", views: 6100 },
    { title: " Khoa học Tự nhiên THCS", views: 4800 },
    { title: "Luyện thi vào lớp 10", views: 3900 },
]

export function TopCoursesChart() {
    const { data, isLoading } = useQuery({
        queryKey: ['analytics', 'overview'],
        queryFn: async () => {
            const res = await analyticsApi.getOverview()
            return 'data' in res ? (res as any).data?.content?.topCourses ?? mockCourses : res?.content?.topCourses ?? mockCourses
        },
        retry: 1,
    })

    const chartData = Array.isArray(data) && data.length > 0
        ? data.slice(0, 6).map((d: any) => ({
            name: (d.title || d.url || "Unknown").length > 25
                ? (d.title || d.url).substring(0, 25) + "..."
                : (d.title || d.url),
            views: d.views || d.count || d.value,
        }))
        : mockCourses.slice(0, 6).map(d => ({ name: d.title, views: d.views }))

    if (isLoading) return <Skeleton className="h-[180px] w-full rounded-xl" />

    if (chartData.length === 0) {
        return <div className="flex items-center justify-center h-[180px] text-muted-foreground text-sm">Chưa có dữ liệu</div>
    }

    return (
        <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                <YAxis
                    type="category"
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10 }}
                    width={130}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                    }}
                    formatter={(value: number) => [value.toLocaleString(), "Lượt xem"]}
                />
                <Bar dataKey="views" radius={[0, 4, 4, 0]} fill="hsl(var(--chart-1))" />
            </BarChart>
        </ResponsiveContainer>
    )
}
