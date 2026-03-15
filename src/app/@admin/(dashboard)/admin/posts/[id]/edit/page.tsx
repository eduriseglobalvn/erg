"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/admin/ui/button"
import { Sparkles, ArrowUp, StopCircle, X, ChevronLeft } from "lucide-react"
import dynamic from 'next/dynamic'
const SimpleEditor = dynamic(
    () => import('@/components/admin/shared/editor/tiptap-templates/simple/simple-editor').then(m => ({ default: m.SimpleEditor })),
    { ssr: false, loading: () => <div className="h-64 animate-pulse rounded-md bg-muted" /> }
)
import { PostSidebar } from "@/components/admin/shared/post-sidebar"
import { useAiWriter } from "@/hooks/use-ai-writer"
import { useEditPost } from "@/hooks/use-edit-post"
import { postsApi } from "@/services/posts.api"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { AiWriterBar } from "@/components/admin/shared/editor/tiptap-ui/ai-writer-bar"

export default function EditPostPage() {
    const params = useParams()
    const id = params.id as string

    const [editorInstance, setEditorInstance] = useState<import('@tiptap/core').Editor | null>(null);
    const [showAiInput, setShowAiInput] = useState(false);

    const {
        fetchedPost,
        isLoading,
        title,
        setTitle,
        postMetadata,
        setPostMetadata,
        handleSave,
        handleSaveDraft,
        isSaving
    } = useEditPost(id, editorInstance);

    const { isGenerating, progress, generateFullPost, refineText } = useAiWriter(editorInstance);

    const handleAiSuccess = (aiData: { title?: string, content?: string, slug?: string, excerpt?: string, category?: { id: string }, categoryId?: string, thumbnailUrl?: string }) => {
        if (aiData.title) setTitle(aiData.title);
        if (editorInstance && aiData.content) {
            editorInstance.commands.setContent(aiData.content);
        }

        // Cập nhật Metadata cho Sidebar
        setPostMetadata(prev => ({
            ...prev,
            slug: aiData.slug || prev.slug,
            excerpt: aiData.excerpt || prev.excerpt,
            categoryId: aiData.category?.id || aiData.categoryId || prev.categoryId,
            thumbnailUrl: aiData.thumbnailUrl || prev.thumbnailUrl
        }));

        setShowAiInput(false); // Đóng chatbox sau khi hoàn tất
    };

    const handleStartAi = (topic: string) => {
        if (topic.trim()) {
            generateFullPost(topic, postMetadata.categoryId || "DEFAULT_CAT_ID", handleAiSuccess);
        }
    }

    const isInputVisible = showAiInput || isGenerating;

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center bg-white dark:bg-[#191919]">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                    <p className="text-muted-foreground animate-pulse font-medium">Đang tải nội dung bài viết...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-[calc(100vh-4rem)] w-full bg-white dark:bg-[#191919] overflow-hidden relative group">

            <main className="flex-1 flex flex-col min-w-0 relative h-full">
                {/* Header Actions */}
                <div className="h-14 border-b flex items-center justify-between px-6 bg-white dark:bg-[#191919] shrink-0">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" asChild className="text-muted-foreground">
                            <Link href="/admin/posts">
                                <ChevronLeft className="h-4 w-4 mr-1" /> Quay lại
                            </Link>
                        </Button>
                        <div className="h-4 w-px bg-border sm:block hidden" />
                        <span className="text-sm font-medium text-muted-foreground truncate hidden sm:block flex-1 min-w-0" title={fetchedPost?.title}>
                            Đang chỉnh sửa: {fetchedPost?.title}
                        </span>
                    </div>
                </div>

                {/* Khu vực Editor */}
                <div className="flex-1 min-h-0 relative">
                    <SimpleEditor
                        initialContent={fetchedPost?.content || ""}
                        onEditorReady={setEditorInstance}
                        onRefine={refineText}
                        title={title}
                        onTitleChange={setTitle}
                    />
                </div>

                {/* AI Input Overlay */}
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
                    post={{ ...postMetadata, id, title, content: "" }}
                    onUpdate={(data) => setPostMetadata(prev => ({ ...prev, ...data }))}
                    onSave={handleSave}
                    onSaveDraft={handleSaveDraft} // Truyền xuống Sidebar
                    isSaving={isSaving}
                    editor={editorInstance}
                />
            </aside>
        </div>
    )
}
