"use client"

import { PostsTable } from "@/components/admin/posts/posts-table"

export default function ArchivedPostsPage() {
    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-primary">Bài viết tạm ẩn</h1>
                <p className="text-muted-foreground">
                    Danh sách các bài viết đang tạm ẩn khỏi giao diện người dùng.
                </p>
            </div>

            <div className="w-full">
                <PostsTable status="achired" />
            </div>
        </div>
    )
}
