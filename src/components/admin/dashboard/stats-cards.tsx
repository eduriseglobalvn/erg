"use client"

import { TrendingUp, Users, FileText, Activity, Globe } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { analyticsApi, DashboardOverview } from "@/services/analytics.api"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/admin/ui/skeleton"


export function StatsCards() {
    const { data: rawData, isLoading: isLoadingOverview } = useQuery({
        queryKey: ['admin', 'overview'],
        queryFn: async () => {
            const res = await analyticsApi.getOverview()
            return 'data' in res ? (res as any).data : res
        }
    })

    const { data: postData, isLoading: isLoadingSummary } = useQuery({
        queryKey: ['analytics', 'posts', 'summary', '90d'],
        queryFn: () => analyticsApi.getPostSummary('90d').then(res => res.data)
    })

    const isLoading = isLoadingOverview || isLoadingSummary
    const stats = rawData || {}
    const postStats = postData?.overview || { totalPosts: 0, publishedPosts: 0, draftPosts: 0 }



    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-4 w-4 rounded-full" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-[60px] mb-1" />
                            <Skeleton className="h-3 w-[140px]" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: Total Visits */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Visits</CardTitle>
                    <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{(stats.totalVisits || 0).toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground mt-1">Lượt truy cập tổng hợp</p>
                </CardContent>
            </Card>

            {/* Card 2: Active Users */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
                    <Activity className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{(stats.activeUsers || 0).toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground mt-1">Người dùng hoạt động</p>
                </CardContent>
            </Card>

            {/* Card 3: Total Posts (Mới từ API Insight) */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Posts</CardTitle>
                    <FileText className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{(postStats.totalPosts).toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        <span className="text-green-600 font-bold">{postStats.publishedPosts}</span> đăng - <span className="text-orange-500 font-bold">{postStats.draftPosts}</span> nháp
                    </p>
                </CardContent>
            </Card>

            {/* Card 4: System Health */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Active Sessions</CardTitle>
                    <Activity className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{(stats.activeUsers || 0).toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground mt-1">Phiên đang hoạt động</p>
                </CardContent>
            </Card>
        </div>
    )
}
