"use client"

import { useState, useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { Button } from "@/components/admin/ui/button"
import { Sparkles, ArrowUp, StopCircle, X } from "lucide-react"
import type { Editor } from "@tiptap/core"
import dynamic from 'next/dynamic'
const SimpleEditor = dynamic(
    () => import('@/components/admin/shared/editor/tiptap-templates/simple/simple-editor').then(m => ({ default: m.SimpleEditor })),
    { ssr: false, loading: () => <div className="h-64 animate-pulse rounded-md bg-muted" /> }
)
import { PostSidebar } from "@/components/admin/shared/post-sidebar"
import { useAiWriter } from "@/hooks/use-ai-writer"
import { useCreatePost } from "@/hooks/use-create-post"
import { motion, AnimatePresence } from "framer-motion"
import { AiWriterBar } from "@/components/admin/shared/editor/tiptap-ui/ai-writer-bar"
import { ProtectedRoute } from "@/components/admin/shared/protected-route"

export default function CreatePostPage() {
    const [editorInstance, setEditorInstance] = useState<Editor | null>(null);
    const [showAiInput, setShowAiInput] = useState(false);

    const {
        title,
        setTitle,
        postMetadata,
        setPostMetadata,
        handleSave,
        handleSaveDraft,
        isSaving
    } = useCreatePost(editorInstance);

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

        setShowAiInput(false); // [NEW] Tự động đóng khung AI sau khi viết xong
    };

    const handleStartAi = (topic: string, config?: any) => {
        if (topic.trim()) {
            generateFullPost(topic, postMetadata.categoryId || "DEFAULT_CAT_ID", handleAiSuccess, config);
        }
    }

    const isInputVisible = showAiInput || isGenerating;

    return (
        <ProtectedRoute permission="posts.create">
        <div className="flex h-[calc(100vh-4rem)] w-full bg-white dark:bg-[#191919] overflow-hidden relative group">

            <main className="flex-1 flex flex-col min-w-0 relative h-full">

                {/* Khu vực Editor */}
                <div className="flex-1 min-h-0 relative border-t">
                    <SimpleEditor
                        initialContent=""
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
                    post={{ ...postMetadata, title, content: "" }}
                    onUpdate={(data) => setPostMetadata(prev => ({ ...prev, ...data }))}
                    onSave={handleSave}
                    onSaveDraft={handleSaveDraft}
                    isSaving={isSaving}
                    editor={editorInstance}
                />
            </aside>
        </div>
        </ProtectedRoute>
    )
}