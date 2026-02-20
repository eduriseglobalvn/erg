import { SeoRedirectsManager } from "@/components/admin/seo/seo-redirects-manager"
import { Separator } from "@/components/admin/ui/separator"

export default function SeoRedirectsPage() {
    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Redirects Management</h2>
                    <p className="text-muted-foreground">
                        Cấu hình các quy tắc chuyển hướng URL cũ sang URL mới.
                    </p>
                </div>
            </div>
            <Separator />
            <div className="grid gap-4">
                <SeoRedirectsManager />
            </div>
        </div>
    )
}
