import { Metadata } from "next"
import { PostsTable } from "@/components/admin/posts/posts-table"
import { createPageMetadata } from "@/utils/seo/page-metadata"

export const metadata: Metadata = createPageMetadata({
    title: "Thung rac bai viet | ERG Admin",
    description: "Danh sach bai viet da xoa mem trong he thong",
    path: "/posts/trash",
    imageAlt: "ERG Admin trash posts",
    robots: { index: false, follow: false },
})

export default function TrashPostsPage() {
    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-primary">Thung rac bai viet</h1>
                <p className="text-muted-foreground">
                    Xem, khoi phuc hoac xoa vinh vien cac bai viet da duoc chuyen vao thung rac.
                </p>
            </div>

            <div className="w-full min-w-0 overflow-hidden">
                <PostsTable isTrash />
            </div>
        </div>
    )
}
