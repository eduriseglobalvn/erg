"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/admin/ui/button"
import { PostSidebar } from "@/components/admin/shared/post-sidebar"
import { useAiWriter } from "@/hooks/use-ai-writer"
import { useEditPost } from "@/hooks/use-edit-post"
import { Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const SimpleEditor = dynamic(
    () => import("@/components/admin/shared/editor/tiptap-templates/simple/simple-editor").then(m => ({ default: m.SimpleEditor })),
    {
        ssr: false,
        loading: () => <div className="h-full w-full flex items-center justify-center bg-white dark:bg-[#191919]">
            <div className="h-64 w-full max-w-4xl mx-auto animate-pulse bg-muted rounded-md" />
        </div>
    }
)

const AiWriterBar = dynamic(
    () => import("@/components/admin/shared/editor/tiptap-ui/ai-writer-bar").then(m => ({ default: m.AiWriterBar })),
    { ssr: false }
)

export function EditPostPageClient({ postId }: { postId: string }) {
    const [editorInstance, setEditorInstance] = useState<any>(null)
    const [showAiInput, setShowAiInput] = useState(false)

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
    } = useEditPost(postId, editorInstance)

    const { isGenerating, progress, generateFullPost, refineText } = useAiWriter(editorInstance)

    const handleAiSuccess = (aiData: any) => {
        if (aiData.title) setTitle(aiData.title)
        if (editorInstance && aiData.content) {
            editorInstance.commands.setContent(aiData.content)
        }

        setPostMetadata(prev => ({
            ...prev,
            slug: aiData.slug || prev.slug,
            excerpt: aiData.excerpt || prev.excerpt,
            categoryId: aiData.category?.id || aiData.categoryId || prev.categoryId,
            thumbnailUrl: aiData.thumbnailUrl || prev.thumbnailUrl
        }))

        setShowAiInput(false)
    }

    const handleStartAi = (topic: string) => {
        if (topic.trim()) {
            generateFullPost(topic, postMetadata.categoryId || "DEFAULT_CAT_ID", handleAiSuccess)
        }
    }

    if (!postId) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center text-sm text-muted-foreground">
                Khong tim thay ID bai viet.
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-4rem)] w-full bg-white dark:bg-[#191919]">
                <div className="flex-1 flex items-center justify-center">
                    <div className="h-64 w-full max-w-4xl animate-pulse rounded-md bg-muted" />
                </div>
                <div className="hidden lg:block w-[350px] border-l bg-gray-50/30" />
            </div>
        )
    }

    if (!fetchedPost) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center text-sm text-muted-foreground">
                Khong tim thay bai viet.
            </div>
        )
    }

    const isInputVisible = showAiInput || isGenerating
    const content = editorInstance?.getHTML() || fetchedPost.content || ""

    return (
        <div className="flex h-[calc(100vh-4rem)] w-full bg-white dark:bg-[#191919] overflow-hidden relative group">
            <main className="flex-1 flex flex-col min-w-0 relative h-full">
                <div className="flex-1 min-h-0 relative border-t">
                    <SimpleEditor
                        initialContent={fetchedPost.content || ""}
                        onEditorReady={setEditorInstance}
                        onRefine={refineText}
                        title={title}
                        onTitleChange={setTitle}
                    />
                </div>

                <AnimatePresence mode="wait">
                    {isInputVisible ? (
                        <AiWriterBar
                            isGenerating={isGenerating}
                            progress={progress}
                            onStart={handleStartAi}
                            onClose={() => setShowAiInput(false)}
                        />
                    ) : (
                        <motion.div
                            key="ai-fab"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute bottom-6 right-8 z-50 text-right"
                        >
                            <div className="group flex items-center gap-3">
                                <span className="px-3 py-1.5 rounded-lg bg-black/80 text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">AI WRITER</span>
                                <Button
                                    className="h-14 w-14 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
                                    onClick={() => setShowAiInput(true)}
                                >
                                    <Sparkles className="w-6 h-6" />
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <aside className="w-[350px] border-l hidden lg:block shrink-0 h-full overflow-hidden z-10 bg-gray-50/30">
                <PostSidebar
                    post={{ id: postId, ...postMetadata, title, content }}
                    onUpdate={(data) => setPostMetadata(prev => ({ ...prev, ...data }))}
                    onSave={handleSave}
                    onSaveDraft={handleSaveDraft}
                    isSaving={isSaving}
                    editor={editorInstance}
                />
            </aside>
        </div>
    )
}
