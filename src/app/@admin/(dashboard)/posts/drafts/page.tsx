import { Metadata } from "next"
import { PostsTable } from "@/components/admin/posts/posts-table"

export const metadata: Metadata = {
    title: "Bai nhap | ERG Admin",
    description: "Danh sach bai viet dang o trang thai ban nhap",
}

export default function DraftPostsPage() {
    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-primary">Bai nhap & Cho xu ly</h1>
                <p className="text-muted-foreground">
                    Quan ly cac bai viet chua duoc xuat ban tren he thong tin tuc cua ERG.
                </p>
            </div>

            <div className="w-full min-w-0 overflow-hidden">
                <PostsTable status="DRAFT" />
            </div>
        </div>
    )
}
