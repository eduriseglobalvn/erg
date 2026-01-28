"use client"

import { PostsTable } from "@/components/admin/posts/posts-table"

export default function TrashPage() {
    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-destructive">Thùng rác</h1>
                <p className="text-muted-foreground">
                    Danh sách các bài viết đã bị xóa. Bạn có thể khôi phục hoặc xóa vĩnh viễn chúng tại đây.
                </p>
            </div>

            <div className="w-full">
                <PostsTable isTrash={true} />
            </div>
        </div>
    )
}
