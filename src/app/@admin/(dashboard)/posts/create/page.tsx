"use client"

import { useState } from "react"
import { Button } from "@/components/admin/ui/button"
import { Sparkles, ArrowUp, StopCircle, X } from "lucide-react"
import { SimpleEditor } from "@/components/admin/shared/editor/tiptap-templates/simple/simple-editor"
import { PostSidebar } from "@/components/admin/shared/post-sidebar"
import { useAiWriter } from "@/hooks/use-ai-writer"

// Import Framer Motion
import { motion, AnimatePresence } from "framer-motion"

export default function CreatePostPage() {
    const [editorInstance, setEditorInstance] = useState<any>(null);
    const [title, setTitle] = useState("");
    const [aiTopic, setAiTopic] = useState("");
    const [showAiInput, setShowAiInput] = useState(false);

    const { isGenerating, progress, generateFullPost, refineText } = useAiWriter(editorInstance);

    const handleAiSuccess = (postData: any) => {
        if (postData.title) setTitle(postData.title);
        if (editorInstance && postData.content) {
            editorInstance.commands.setContent(postData.content);
        }
        if (postData.id) {
            window.history.replaceState(null, '', `/admin/posts/${postData.id}/edit`);
        }
        setAiTopic("");
        // Tùy chọn: Tự động đóng sau khi xong (nếu muốn)
        // setShowAiInput(false);
    };

    const handleStartAi = () => {
        if (aiTopic.trim()) {
            generateFullPost(aiTopic, "DEFAULT_CAT_ID", handleAiSuccess);
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

                {/* === KHU VỰC AI (Sử dụng AnimatePresence để quản lý hiệu ứng ra/vào) === */}
                <AnimatePresence mode="wait">

                    {/* TRƯỜNG HỢP 1: HIỂN THỊ THANH INPUT */}
                    {isInputVisible ? (
                        <motion.div
                            key="ai-input-bar"
                            // Hiệu ứng vào: Trượt từ dưới lên, mờ dần -> rõ, scale từ nhỏ -> to
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } }}
                            // Spring config: độ nảy (bounce), độ cứng (stiffness) tạo cảm giác vật lý
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-50"
                        >
                            <div className="relative flex items-center gap-2 p-1.5 pl-3 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#333] rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                                {/* Icon trạng thái */}
                                <div className="shrink-0">
                                    {isGenerating ? (
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/20">
                                            <Sparkles className="w-4 h-4 text-purple-600 animate-spin" />
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 dark:bg-[#2a2a2a]">
                                            <Sparkles className="w-4 h-4 text-gray-400" />
                                        </div>
                                    )}
                                </div>

                                {/* Input / Progress */}
                                {isGenerating ? (
                                    <div className="flex-1 px-3 h-10 flex flex-col justify-center gap-1.5">
                                        <div className="flex justify-between items-center text-xs font-medium text-purple-600 dark:text-purple-400">
                                            <motion.span
                                                animate={{ opacity: [0.5, 1, 0.5] }}
                                                transition={{ repeat: Infinity, duration: 1.5 }}
                                            >
                                                AI đang suy nghĩ...
                                            </motion.span>
                                            <span>{progress}%</span>
                                        </div>
                                        <div className="h-1 w-full bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-purple-600"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                transition={{ type: "spring", stiffness: 50 }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <input
                                        className="flex-1 bg-transparent border-none outline-none h-11 px-2 text-[15px] placeholder:text-gray-400 text-black dark:text-gray-200"
                                        placeholder="Hỏi AI để viết bài (VD: Lợi ích của React Server Components)..."
                                        value={aiTopic}
                                        onChange={(e) => setAiTopic(e.target.value)}
                                        onKeyDown={(e) => {
                                            if(e.key === 'Enter' && !isGenerating) handleStartAi();
                                        }}
                                        autoFocus
                                    />
                                )}

                                {/* Actions */}
                                <div className="flex items-center gap-1 pr-1">
                                    {!isGenerating && (
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="rounded-full w-8 h-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-[#333]"
                                            onClick={() => setShowAiInput(false)}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    )}

                                    <Button
                                        size="icon"
                                        className={`rounded-full shrink-0 w-9 h-9 transition-all duration-200 ${
                                            aiTopic
                                                ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-md'
                                                : 'bg-gray-100 text-gray-300 dark:bg-[#2a2a2a] dark:text-gray-600 cursor-not-allowed'
                                        }`}
                                        onClick={handleStartAi}
                                        disabled={!aiTopic || isGenerating}
                                    >
                                        {isGenerating ? <StopCircle className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        /* TRƯỜNG HỢP 2: HIỂN THỊ NÚT TRÒN (FAB) */
                        <motion.div
                            key="ai-fab"
                            // Hiệu ứng: Zoom in từ 0 -> 1, xoay nhẹ
                            initial={{ scale: 0, rotate: 45, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            exit={{ scale: 0, rotate: 45, opacity: 0, transition: { duration: 0.2 } }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            className="absolute bottom-6 right-8 z-50"
                        >
                            <Button
                                className="h-14 w-14 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-[0_8px_30px_rgb(124,58,237,0.3)] hover:shadow-[0_8px_30px_rgb(124,58,237,0.5)]"
                                onClick={() => setShowAiInput(true)}
                            >
                                <Sparkles className="w-6 h-6" />
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>

            </main>

            <aside className="w-[350px] border-l hidden lg:block shrink-0 h-full overflow-hidden z-10 bg-gray-50/30">
                <PostSidebar />
            </aside>
        </div>
    )
}