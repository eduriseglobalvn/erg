import { PostsTable } from "@/components/cms/posts/posts-table"
import { Metadata } from "next"
import { Skeleton } from "@/components/cms/ui/skeleton"
import { createPageMetadata } from "@/utils/seo/page-metadata"

export const metadata: Metadata = createPageMetadata({
    title: "Quản lý bài viết | ERG CMS",
    description: "Danh sách tất cả bài viết trên hệ thống",
    path: "/cms/posts",
    imageAlt: "ERG CMS posts",
    robots: { index: false, follow: false },
})

// ✅ Phase 4: Suspense boundary for async data fetching
function PostsTableSkeleton() {
    return (
        <div className="flex flex-col gap-4 p-6">
            <div className="h-10 w-64 animate-pulse bg-muted rounded" />
            <div className="space-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full rounded" />
                ))}
            </div>
        </div>
    )
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

            <div className="w-full min-w-0 overflow-hidden">
                <PostsTable />
            </div>
        </div>
    )
}
