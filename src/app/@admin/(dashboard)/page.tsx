import { StatsCards } from "@/components/admin/dashboard/stats-cards"
import { VisitorsChart } from "@/components/admin/dashboard/visitors-chart"
import { AnalyticsBarChart } from "@/components/admin/dashboard/analytics-bar-chart"
import { AnalyticsPieChart } from "@/components/admin/dashboard/analytics-pie-chart"
import { AnalyticsRadialChart } from "@/components/admin/dashboard/analytics-radial-chart"

export default function AdminPage() {
    return (
        <div className="flex flex-1 flex-col gap-6 space-y-2">
            {/* Hàng 1: Các thẻ thống kê */}
            <StatsCards />

            {/* Hàng 2: Biểu đồ Truy cập (Traffic) */}
            <div className="grid gap-4 md:grid-cols-1">
                <VisitorsChart />
            </div>

            {/* Hàng 3: Grid các biểu đồ phân tích */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Bar Chart - Thống kê bài viết */}
                <AnalyticsBarChart />

                {/* Pie Chart - Phân bổ theo danh mục */}
                <AnalyticsPieChart />

                {/* Radial Chart - Người dùng hoạt động */}
                <AnalyticsRadialChart />
            </div>
        </div>
    )
}