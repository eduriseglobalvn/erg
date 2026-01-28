import { CategoryTable } from "@/components/admin/taxonomy/category-table"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Quản lý chuyên mục | ERG Admin",
    description: "Quản lý danh mục bài viết trên hệ thống",
}

export default function CategoriesPage() {
    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-primary uppercase">Quản lý chuyên mục</h1>
                <p className="text-muted-foreground">
                    Thêm, sửa và quản lý các danh mục nội dung trên hệ thống.
                    Lưu ý: Bạn không thể xóa chuyên mục nếu vẫn còn bài viết bên trong.
                </p>
            </div>

            <div className="w-full">
                <CategoryTable />
            </div>
        </div>
    )
}
