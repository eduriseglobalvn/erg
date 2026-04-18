"use client"

/**
 * Horizontal Bar Chart: Top Posts
 * Dùng dữ liệu từ GET /api/insight/overview → content.topPosts
 */

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { useQuery } from "@tanstack/react-query"
import { analyticsApi } from "@/services/analytics.api"
import { Skeleton } from "@/components/admin/ui/skeleton"

const mockPosts = [
    { title: "Cách học Toán hiệu quả cho trẻ tiểu học", views: 12000 },
    { title: "Bí quyết chinh phục IELTS 8.0+", views: 9800 },
    { title: "Top 10 ngành nghề triển vọng 2026", views: 7600 },
    { title: "Hướng dẫn đăng ký thi HSG cấp tỉnh", views: 5400 },
    { title: "Phương pháp học tập chủ động", views: 4100 },
]

export function TopPostsChart() {
    const { data, isLoading } = useQuery({
        queryKey: ['analytics', 'overview'],
        queryFn: async () => {
            const res = await analyticsApi.getOverview()
            return 'data' in res ? (res as any).data?.content?.topPosts ?? mockPosts : res?.content?.topPosts ?? mockPosts
        },
        retry: 1,
    })

    const chartData = Array.isArray(data) && data.length > 0
        ? data.slice(0, 6).map((d: any) => ({
            name: (d.title || d.url || "Unknown").length > 28
                ? (d.title || d.url).substring(0, 28) + "..."
                : (d.title || d.url),
            views: d.views || d.count || d.value,
        }))
        : mockPosts.slice(0, 6).map(d => ({ name: d.title, views: d.views }))

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
                    width={150}
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
                <Bar dataKey="views" radius={[0, 4, 4, 0]} fill="hsl(var(--chart-2))" />
            </BarChart>
        </ResponsiveContainer>
    )
}
