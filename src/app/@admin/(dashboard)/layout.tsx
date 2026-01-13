import { AppSidebar } from "@/components/admin/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/admin/ui/sidebar"
import { AdminHeader } from "@/components/admin/shared/admin-header"
import { ThemeProvider } from "@/components/admin/theme-provider"

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode
}) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
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
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </ThemeProvider>
    )
}