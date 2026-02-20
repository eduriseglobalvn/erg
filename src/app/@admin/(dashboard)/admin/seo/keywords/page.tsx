import { KeywordManager } from "@/components/admin/seo/keyword-manager"
import { Separator } from "@/components/admin/ui/separator"

export default function SeoKeywordsPage() {
    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">SEO Auto-Linking</h2>
                    <p className="text-muted-foreground">
                        Cấu hình hệ thống từ khóa và liên kết nội bộ tự động.
                    </p>
                </div>
            </div>
            <Separator />
            <div className="grid gap-4">
                <KeywordManager />
            </div>
        </div>
    )
}
