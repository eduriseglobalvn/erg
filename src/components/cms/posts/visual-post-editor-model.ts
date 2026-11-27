import type { BlockCategory, BlockTemplate, PostMetadata } from "./visual-post-editor-types"

export function filterBlockTemplates(
    templates: BlockTemplate[],
    category: BlockCategory | "Tất cả",
    search: string,
) {
    const query = search.trim().toLowerCase()
    return templates.filter((template) => {
        const matchesCategory = category === "Tất cả" || template.category === category
        const matchesQuery = !query
            || template.title.toLowerCase().includes(query)
            || template.description.toLowerCase().includes(query)
            || template.category.toLowerCase().includes(query)
        return matchesCategory && matchesQuery
    })
}

export function createPreviewPost(title: string, postMetadata: PostMetadata) {
    return {
        title: title || "Tiêu đề bài viết sẽ hiển thị tại đây",
        excerpt: postMetadata.excerpt || "Mô tả ngắn của bài viết sẽ hiển thị ở khu vực public preview.",
        category: "ERG",
        thumbnailUrl: postMetadata.thumbnailUrl,
    }
}
