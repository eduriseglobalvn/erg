"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { PostsTable } from "@/components/admin/posts/posts-table"
import { postsApi } from "@/services/posts.api"

export default function CategoryPostsPage() {
    const params = useParams()
    const slug = params.id as string

    // Fetch thực tế từ API (Client side - Có accessToken từ localStorage)
    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => postsApi.getCategories().then(res => res.data)
    })

    const displayTitle = React.useMemo(() => {
        if (!categories) return slug.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

        const category = categories.find(c => c.slug === slug);
        return category ? category.name : slug.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    }, [categories, slug])

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-primary">Chuyên mục: {displayTitle}</h1>
                <p className="text-muted-foreground">
                    Danh sách các bài viết thuộc chuyên mục {displayTitle}.
                </p>
            </div>

            <div className="w-full">
                <PostsTable categorySlug={slug} />
            </div>
        </div>
    )
}
