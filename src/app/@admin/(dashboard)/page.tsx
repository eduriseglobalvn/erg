import { StatsCards } from "@/components/admin/dashboard/stats-cards"
import { SeoHealthCard } from "@/components/admin/dashboard/seo-health-card"
import { VisitorsChart } from "@/components/admin/dashboard/visitors-chart"
import { AnalyticsBarChart } from "@/components/admin/dashboard/analytics-bar-chart"
import { AnalyticsPieChart } from "@/components/admin/dashboard/analytics-pie-chart"
import { AnalyticsRadialChart } from "@/components/admin/dashboard/analytics-radial-chart"
import { SeoStatsCards } from "@/components/admin/dashboard/seo-stats-cards"
import { SeoTopQueriesChart } from "@/components/admin/dashboard/seo-top-queries-chart"
import { SeoTopPerformingPosts } from "@/components/admin/dashboard/seo-top-performing-posts"

export default function AdminPage() {
    return (
        <div className="flex flex-1 flex-col gap-6 p-4">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
                <p className="text-sm text-muted-foreground italic">Chào buổi chiều, Admin! Đây là tổng quan hiệu suất hệ thống ERG hôm nay.</p>
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