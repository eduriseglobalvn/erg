"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAiWriter } from "@/hooks/use-ai-writer"
import { postsApi } from "@/services/posts.api"
import { VisualPostEditorWorkspace } from "@/components/admin/posts/visual-post-editor-workspace"

export default function CreatePostPage() {
    const router = useRouter()
    const [editorInstance, setEditorInstance] = useState<any>(null)
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [contentBlocks, setContentBlocks] = useState<unknown[] | null>(null)

    const [postMetadata, setPostMetadata] = useState({
        slug: "",
        excerpt: "",
        categoryId: "",
        thumbnailUrl: null as string | null,
        status: "draft",
    })

    const { isGenerating, progress, generateFullPost, refineText } = useAiWriter(editorInstance)

    const createMutation = useMutation({
        mutationFn: (data: any) => postsApi.create(data),
        onSuccess: (res: any) => {
            const id = res.data?.id || res.id
            toast.success("Đã đăng bài viết thành công!")
            router.push(`/posts/${id}/edit`)
        },
        onError: (error: any) => {
            toast.error(error.message || "Lỗi khi đăng bài viết")
        },
    })

    const handleSave = () => {
        if (!title.trim()) {
            toast.error("Vui lòng nhập tiêu đề bài viết")
            return
        }

        const finalContent = content || editorInstance?.getHTML() || ""

        createMutation.mutate({
            ...postMetadata,
            title,
            content: finalContent,
            contentHtml: finalContent,
            ...(contentBlocks?.length ? { contentBlocks } : {}),
        })
    }

    const handleAiSuccess = (aiData: any) => {
        if (aiData.title) setTitle(aiData.title)
        if (editorInstance && aiData.content) {
            editorInstance.commands.setContent(aiData.content)
            setContent(editorInstance.getHTML())
        } else if (aiData.content) {
            setContent(aiData.content)
        }

        setPostMetadata(prev => ({
            ...prev,
            slug: aiData.slug || prev.slug,
            excerpt: aiData.excerpt || prev.excerpt,
            categoryId: aiData.category?.id || aiData.categoryId || prev.categoryId,
            thumbnailUrl: aiData.thumbnailUrl || prev.thumbnailUrl,
        }))
    }

    const handleStartAi = (topic: string) => {
        if (topic.trim()) {
            generateFullPost(topic, postMetadata.categoryId || "DEFAULT_CAT_ID", handleAiSuccess)
        }
    }

    return (
        <VisualPostEditorWorkspace
            mode="create"
            title={title}
            onTitleChange={setTitle}
            initialContent=""
            content={content}
            onContentChange={setContent}
            onStructuredContentChange={setContentBlocks}
            postMetadata={postMetadata}
            onMetadataChange={(data) => setPostMetadata(prev => ({ ...prev, ...data }))}
            onSave={handleSave}
            onSaveDraft={handleSave}
            isSaving={createMutation.isPending}
            isGenerating={isGenerating}
            aiProgress={progress}
            onStartAi={handleStartAi}
            onRefine={refineText}
            onEditorReady={setEditorInstance}
        />
    )
}
