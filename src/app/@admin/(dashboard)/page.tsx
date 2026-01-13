import { StatsCards } from "@/components/admin/dashboard/stats-cards"
import { VisitorsChart } from "@/components/admin/dashboard/visitors-chart"
import { ProjectTable } from "@/components/admin/dashboard/project-table"

export default function AdminPage() {
    return (
        <div className="flex flex-1 flex-col gap-6 space-y-2">
            {/* Hàng 1: Các thẻ thống kê */}
            <StatsCards />

            {/* Hàng 2: Biểu đồ */}
            <VisitorsChart />

            {/* Hàng 3: Bảng dự án */}
            <ProjectTable />
        </div>
    )
}