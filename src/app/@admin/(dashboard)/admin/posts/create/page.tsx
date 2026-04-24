"use client"

import { useState, useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Button } from "@/components/admin/ui/button"
import { Sparkles, ArrowUp, StopCircle, X } from "lucide-react"
import { PostSidebar } from "@/components/admin/shared/post-sidebar"
import { useAiWriter } from "@/hooks/use-ai-writer"
import { postsApi } from "@/services/posts.api"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

// ✅ Phase 4: Dynamic imports for heavy Tiptap editor
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

export default function CreatePostPage() {
    const router = useRouter();
    const [editorInstance, setEditorInstance] = useState<any>(null);
    const [title, setTitle] = useState("");
    const [showAiInput, setShowAiInput] = useState(false);

    const [postMetadata, setPostMetadata] = useState({
        slug: "",
        excerpt: "",
        categoryId: "",
        thumbnailUrl: null as string | null,
        status: "draft"
    });

    const { isGenerating, progress, generateFullPost, refineText } = useAiWriter(editorInstance);

    // Create Mutation
    const createMutation = useMutation({
        mutationFn: (data: any) => postsApi.create(data),
        onSuccess: (res: any) => {
            const id = res.data?.id || res.id;
            toast.success("Đã đăng bài viết thành công!");
            router.push(`/admin/posts/${id}/edit`);
        },
        onError: (error: any) => {
            toast.error(error.message || "Lỗi khi đăng bài viết");
        }
    })

    const handleSave = () => {
        if (!title.trim()) {
            toast.error("Vui lòng nhập tiêu đề bài viết");
            return;
        }
        createMutation.mutate({
            ...postMetadata,
            title,
            content: editorInstance?.getHTML() || "",
        });
    };

    const handleAiSuccess = (aiData: any) => {
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

        setShowAiInput(false);
    };

    const handleStartAi = (topic: string) => {
        if (topic.trim()) {
            generateFullPost(topic, postMetadata.categoryId || "DEFAULT_CAT_ID", handleAiSuccess);
        }
    }

    // Biến kiểm tra để hiển thị thanh Input
    const isInputVisible = showAiInput || isGenerating;

    return (
        <div className="flex h-[calc(100vh-4rem)] w-full bg-white dark:bg-[#191919] overflow-hidden relative group">

            <main className="flex-1 flex flex-col min-w-0 relative h-full">
                {/* [UPDATE] Đã xóa thẻ Input cũ ở đây */}

                {/* Khu vực Editor */}
                <div className="flex-1 min-h-0 relative border-t">
                    <SimpleEditor
                        initialContent=""
                        onEditorReady={setEditorInstance}
                        onRefine={refineText}
                        // [NEW] Truyền Title xuống component con
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
                    post={{ ...postMetadata, title, content: "" }}
                    onUpdate={(data) => setPostMetadata(prev => ({ ...prev, ...data }))}
                    onSave={handleSave}
                    isSaving={createMutation.isPending}
                />
            </aside>
        </div>
    )
}