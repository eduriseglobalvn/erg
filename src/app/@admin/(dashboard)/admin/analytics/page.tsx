"use client"

/**
 * Trang Dashboard Analytics dành cho Admin
 * Hiển thị tổng quan lượt truy cập, thiết bị, nguồn traffic, giờ cao điểm...
 *
 * Route: /admin/analytics
 * Permission: system.logs
 */

import dynamic from "next/dynamic"
import { ProtectedRoute } from "@/components/admin/shared/protected-route"
import { AnalyticsSummaryCards } from "@/components/admin/analytics/summary-cards"
import { AnalyticsTimeRangePicker } from "@/components/admin/analytics/time-range-picker"
import { Skeleton } from "@/components/admin/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card"

// Lazy load tất cả chart components để tránh SSR issues với recharts
const TrafficAreaChart = dynamic(
    () => import("@/components/admin/analytics/charts/traffic-area-chart").then(mod => mod.TrafficAreaChart),
    { ssr: false, loading: () => <Skeleton className="h-[300px] w-full rounded-xl" /> }
)
const DevicePieChart = dynamic(
    () => import("@/components/admin/analytics/charts/device-pie-chart").then(mod => mod.DevicePieChart),
    { ssr: false, loading: () => <Skeleton className="h-[250px] w-full rounded-xl" /> }
)
const TrafficSourcesChart = dynamic(
    () => import("@/components/admin/analytics/charts/traffic-sources-chart").then(mod => mod.TrafficSourcesChart),
    { ssr: false, loading: () => <Skeleton className="h-[250px] w-full rounded-xl" /> }
)
const PeakHoursChart = dynamic(
    () => import("@/components/admin/analytics/charts/peak-hours-chart").then(mod => mod.PeakHoursChart),
    { ssr: false, loading: () => <Skeleton className="h-[200px] w-full rounded-xl" /> }
)
const BrowsersPieChart = dynamic(
    () => import("@/components/admin/analytics/charts/browsers-pie-chart").then(mod => mod.BrowsersPieChart),
    { ssr: false, loading: () => <Skeleton className="h-[250px] w-full rounded-xl" /> }
)
const OsPieChart = dynamic(
    () => import("@/components/admin/analytics/charts/os-pie-chart").then(mod => mod.OsPieChart),
    { ssr: false, loading: () => <Skeleton className="h-[250px] w-full rounded-xl" /> }
)
const TopLocationsChart = dynamic(
    () => import("@/components/admin/analytics/charts/top-locations-chart").then(mod => mod.TopLocationsChart),
    { ssr: false, loading: () => <Skeleton className="h-[250px] w-full rounded-xl" /> }
)
const TopCoursesChart = dynamic(
    () => import("@/components/admin/analytics/charts/top-courses-chart").then(mod => mod.TopCoursesChart),
    { ssr: false, loading: () => <Skeleton className="h-[200px] w-full rounded-xl" /> }
)
const TopPostsChart = dynamic(
    () => import("@/components/admin/analytics/charts/top-posts-chart").then(mod => mod.TopPostsChart),
    { ssr: false, loading: () => <Skeleton className="h-[200px] w-full rounded-xl" /> }
)

function AnalyticsDashboardContent() {
    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
                <p className="text-sm text-muted-foreground italic">
                    Theo dõi lượt truy cập, hành vi người dùng và hiệu suất nội dung
                </p>
            </div>

            {/* Summary Cards + Time Range Picker */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">Tổng quan</h2>
                    <AnalyticsTimeRangePicker />
                </div>
                <AnalyticsSummaryCards />
            </div>

            {/* Area Chart: Traffic over time (mobile vs desktop) */}
            <TrafficAreaChart />

            {/* Row 2: Device Types + Traffic Sources + Top Locations */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold">Thiết bị</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DevicePieChart />
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold">Nguồn Traffic</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TrafficSourcesChart />
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold">Top Địa điểm</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TopLocationsChart />
                    </CardContent>
                </Card>
            </div>

            {/* Row 3: Peak Hours + Browsers + Operating Systems */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold">Giờ cao điểm (24h)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <PeakHoursChart />
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold">Trình duyệt</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <BrowsersPieChart />
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold">Hệ điều hành</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <OsPieChart />
                    </CardContent>
                </Card>
            </div>

            {/* Row 4: Top Courses + Top Posts */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold">Khóa học phổ biến</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TopCoursesChart />
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold">Bài viết phổ biến</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TopPostsChart />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default function AnalyticsPage() {
    return (
        <ProtectedRoute permission="system.logs">
            <AnalyticsDashboardContent />
        </ProtectedRoute>
    )
}
