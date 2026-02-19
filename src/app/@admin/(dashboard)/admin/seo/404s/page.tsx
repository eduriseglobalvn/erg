import { Seo404Logs } from "@/components/admin/seo/seo-404-logs"
import { Separator } from "@/components/admin/ui/separator"

export default function Seo404Page() {
    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-red-600">404 Monitoring</h2>
                    <p className="text-muted-foreground">
                        Danh sách các đường dẫn hỏng mà người dùng đã truy cập.
                    </p>
                </div>
            </div>
            <Separator />
            <div className="grid gap-4">
                <Seo404Logs />
            </div>
        </div>
    )
}
