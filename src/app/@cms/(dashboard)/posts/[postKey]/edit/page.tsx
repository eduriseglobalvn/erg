import { EditPostPageClient } from "@/components/cms/posts/edit-post-page-client"

export default async function EditPostPage({
    params,
}: {
    params: Promise<{ postKey: string }>
}) {
    const { postKey } = await params

    return <EditPostPageClient postId={postKey} />
}
