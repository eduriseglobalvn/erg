"use client"

import { TrendingUp, Users, FileText, Activity, Globe, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { analyticsApi, DashboardOverview } from "@/services/analytics.api"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/admin/ui/skeleton"
import { cn } from "@/lib/utils"


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
            <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 2 }).map((_, i) => (
                    <Card key={i} className="border-none shadow-sm bg-white/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-8 w-8 rounded-full" />
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
        <div className="grid gap-4 md:grid-cols-2 h-full">
            {/* Card 1: Total Visits */}
            <Card className="border-none shadow-md bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden relative group">
                {/* Decoration */}
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <Globe size={80} />
                </div>

                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                    <CardTitle className="text-sm font-medium text-blue-100">Total Traffic</CardTitle>
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Eye className="h-4 w-4 text-white" />
                    </div>
                </CardHeader>
                <CardContent className="relative z-10">
                    <div className="text-3xl font-bold tracking-tight">{(stats.totalVisits || 0).toLocaleString()}</div>
                    <p className="text-xs text-blue-100 mt-1 font-medium bg-blue-700/30 inline-block px-2 py-0.5 rounded-full">
                        Lượt truy cập hệ thống
                    </p>
                </CardContent>
            </Card>

            {/* Card 2: Total Posts*/}
            <Card className="border-none shadow-md bg-white dark:bg-zinc-900 overflow-hidden relative group">
                {/* Decoration */}
                <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
                    <FileText size={100} className="text-zinc-900 dark:text-zinc-100" />
                </div>

                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Content Status</CardTitle>
                    <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                        <FileText className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
                        {(postStats.totalPosts).toLocaleString()}
                        <span className="text-sm font-normal text-muted-foreground ml-2">bài viết</span>
                    </div>

                    <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/10">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            <span className="text-xs font-bold text-green-700 dark:text-green-400">
                                {postStats.publishedPosts} Pub
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/10">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                                {postStats.draftPosts} Draft
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
