import { PostsTable } from "@/components/admin/posts/posts-table"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Quản lý bài viết | ERG Admin",
    description: "Danh sách tất cả bài viết trên hệ thống",
}

export default function PostsPage() {
    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-primary">Quản lý bài viết</h1>
                <p className="text-muted-foreground">
                    Xem, chỉnh sửa và quản lý tất cả các bài viết trên hệ thống tin tức của ERG.
                </p>
            </div>

            <div className="w-full">
                <PostsTable />
            </div>
        </div>
    )
}
