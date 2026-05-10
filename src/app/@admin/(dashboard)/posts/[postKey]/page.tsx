import { Metadata } from "next"
import { PostsTable } from "@/components/admin/posts/posts-table"
import { createPageMetadata } from "@/utils/seo/page-metadata"

export const metadata: Metadata = createPageMetadata({
    title: "Danh muc bai viet | ERG Admin",
    description: "Danh sach bai viet theo danh muc",
    path: "/posts",
    imageAlt: "ERG Admin category posts",
    robots: { index: false, follow: false },
})

export default async function CategoryPostsPage({
    params,
}: {
    params: Promise<{ postKey: string }>
}) {
    const { postKey } = await params

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-primary">Bai viet theo danh muc</h1>
                <p className="text-muted-foreground">
                    Loc va quan ly cac bai viet thuoc danh muc da chon.
                </p>
            </div>

            <div className="w-full min-w-0 overflow-hidden">
                <PostsTable categorySlug={postKey} />
            </div>
        </div>
    )
}
