"use client"

import { PostsTable } from "@/components/admin/posts/posts-table"

export default function DraftsPage() {
    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-primary">Bài nháp & Chờ xử lý</h1>
                <p className="text-muted-foreground">
                    Danh sách các bài viết đang trong trạng thái nháp hoặc chờ được duyệt.
                </p>
            </div>

            <div className="w-full">
                <PostsTable status="draft" />
            </div>
        </div>
    )
}
