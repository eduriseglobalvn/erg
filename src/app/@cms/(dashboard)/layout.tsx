import { AppSidebar } from "@/components/cms/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/cms/ui/sidebar"
import { AdminHeader } from "@/components/cms/shared/cms-header"
import { ThemeProvider } from "@/components/cms/theme-provider"
import { SectionErrorBoundary } from "@/components/cms/shared/error-boundary"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            forcedTheme="light"
            enableSystem={false}
            disableTransitionOnChange
        >
            <SidebarProvider>
                {/* Sidebar bên trái */}
                <AppSidebar />

                {/* Khu vực nội dung chính bên phải */}
                <SidebarInset>
                    {/* Header: Đã bao gồm nút chuyển ModeToggle */}
                    <AdminHeader />

                    {/* Nội dung trang quản trị */}
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 mt-4">
                        <SectionErrorBoundary>
                            {children}
                        </SectionErrorBoundary>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </ThemeProvider>
    )
}
