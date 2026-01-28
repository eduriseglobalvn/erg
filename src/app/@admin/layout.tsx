import AdminAuthGuard from "@/components/admin/admin-auth-guard"; // <--- Import Guard

export default function AdminSlotLayout({ children }: { children: React.ReactNode }) {
    return (
        // Bọc toàn bộ children bằng AdminAuthGuard
        <AdminAuthGuard>
            {children}
        </AdminAuthGuard>
    );
}