"use client"

import dynamic from "next/dynamic"
import { StatsCards } from "@/components/cms/dashboard/stats-cards"
import { SeoHealthCard } from "@/components/cms/dashboard/seo-health-card"
import { SeoStatsCards } from "@/components/cms/dashboard/seo-stats-cards"
import { SeoTopPerformingPosts } from "@/components/cms/dashboard/seo-top-performing-posts"

import { Skeleton } from "@/components/cms/ui/skeleton"

// Lazy load Recharts-heavy components (B-L3 optimization) with SSR disabled and Skeletons for CLS
const VisitorsChart = dynamic(() => import("@/components/cms/dashboard/visitors-chart").then(mod => mod.VisitorsChart), { ssr: false, loading: () => <Skeleton className="h-[400px] w-full rounded-xl" /> })
const AnalyticsBarChart = dynamic(() => import("@/components/cms/dashboard/analytics-bar-chart").then(mod => mod.AnalyticsBarChart), { ssr: false, loading: () => <Skeleton className="h-[350px] w-full rounded-xl" /> })
const AnalyticsPieChart = dynamic(() => import("@/components/cms/dashboard/analytics-pie-chart").then(mod => mod.AnalyticsPieChart), { ssr: false, loading: () => <Skeleton className="h-[350px] w-full rounded-xl" /> })
const AnalyticsRadialChart = dynamic(() => import("@/components/cms/dashboard/analytics-radial-chart").then(mod => mod.AnalyticsRadialChart), { ssr: false, loading: () => <Skeleton className="h-[350px] w-full rounded-xl" /> })
const SeoTopQueriesChart = dynamic(() => import("@/components/cms/dashboard/seo-top-queries-chart").then(mod => mod.SeoTopQueriesChart), { ssr: false, loading: () => <Skeleton className="h-[350px] w-full rounded-xl" /> })

export default function AdminPage() {
    return (
        <div className="flex flex-1 flex-col gap-6 p-4">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
                <p className="text-sm text-muted-foreground italic">Chào buổi chiều, CMS! Đây là tổng quan hiệu suất hệ thống ERG hôm nay.</p>
            </div>

            {/* Hàng 1: Các thẻ thống kê + SEO Health */}
            {/* Hàng 1: Các thẻ thống kê + SEO Health */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="col-span-2">
                    <StatsCards />
                </div>
                <div className="col-span-2">
                    <SeoHealthCard />
                </div>
            </div>

            {/* Hàng 2: Biểu đồ Truy cập (Traffic) */}
            <div className="grid gap-4 md:grid-cols-1">
                <VisitorsChart />
            </div>

            {/* PHẦN MỚI: SEO PERFORMANCE - GOOGLE SEARCH CONSOLE */}
            <div className="space-y-4 pt-4 border-t border-dashed">
                <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-bold tracking-tight text-blue-600 dark:text-blue-400">SEO Performance (GSC)</h2>
                    <p className="text-xs text-muted-foreground italic">Dữ liệu hiệu suất tìm kiếm từ Google Search Console (30 ngày qua)</p>
                </div>

                {/* 4 Cards GSC */}
                <SeoStatsCards />

                {/* Grid Chart & Top Posts */}
                <div className="grid gap-4 md:grid-cols-2 mt-4">
                    <SeoTopQueriesChart />
                    <SeoTopPerformingPosts />
                </div>
            </div>

            {/* Hàng 3: Grid các biểu đồ phân tích nội bộ */}
            <div className="space-y-4 pt-4 border-t border-dashed">
                <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-bold tracking-tight text-zinc-500">Internal Analytics</h2>
                    <p className="text-xs text-muted-foreground italic">Thống kê bài viết, chuyên mục và dữ liệu hệ thống nội bộ</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <AnalyticsBarChart />
                    <AnalyticsPieChart />
                    <AnalyticsRadialChart />
                </div>
            </div>
        </div>
    )
}