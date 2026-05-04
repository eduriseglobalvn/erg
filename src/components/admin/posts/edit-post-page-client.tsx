"use client"

import { useEffect, useState } from "react"
import { Sparkles } from "lucide-react"
import { useAiWriter } from "@/hooks/use-ai-writer"
import { useEditPost } from "@/hooks/use-edit-post"
import { VisualPostEditorWorkspace } from "@/components/admin/posts/visual-post-editor-workspace"

export function EditPostPageClient({ postId }: { postId: string }) {
    const [editorInstance, setEditorInstance] = useState<any>(null)
    const [content, setContent] = useState("")
    const [contentBlocks, setContentBlocks] = useState<unknown[] | null>(null)

    const {
        fetchedPost,
        isLoading,
        title,
        setTitle,
        postMetadata,
        setPostMetadata,
        handleSave,
        handleSaveDraft,
        isSaving,
    } = useEditPost(postId, editorInstance, content, contentBlocks)

    const { isGenerating, progress, generateFullPost, refineText } = useAiWriter(editorInstance)

    useEffect(() => {
        if (fetchedPost?.content) {
            setContent(fetchedPost.content)
        }
    }, [fetchedPost?.content])

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

    if (!postId) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center text-sm text-muted-foreground">
                Không tìm thấy ID bài viết.
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-3 text-sm text-zinc-500">
                    <Sparkles className="h-8 w-8 animate-pulse text-primary" />
                    Đang tải editor...
                </div>
            </div>
        )
    }

    if (!fetchedPost) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center text-sm text-muted-foreground">
                Không tìm thấy bài viết.
            </div>
        )
    }

    return (
        <VisualPostEditorWorkspace
            mode="edit"
            postId={postId}
            title={title}
            onTitleChange={setTitle}
            initialContent={fetchedPost.content || ""}
            content={content || fetchedPost.content || ""}
            onContentChange={setContent}
            onStructuredContentChange={setContentBlocks}
            postMetadata={postMetadata}
            onMetadataChange={(data) => setPostMetadata(prev => ({ ...prev, ...data }))}
            onSave={handleSave}
            onSaveDraft={handleSaveDraft}
            isSaving={isSaving}
            isGenerating={isGenerating}
            aiProgress={progress}
            onStartAi={handleStartAi}
            onRefine={refineText}
            onEditorReady={setEditorInstance}
        />
    )
}
