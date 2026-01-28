"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, X, StopCircle, ArrowUp } from "lucide-react"
import { Button } from "@/components/admin/ui/button"

interface AiWriterBarProps {
    isGenerating: boolean;
    progress: number;
    onStart: (topic: string) => void;
    onClose: () => void;
}

export function AiWriterBar({ isGenerating, progress, onStart, onClose }: AiWriterBarProps) {
    const [localTopic, setLocalTopic] = useState("");

    const handleStart = () => {
        if (localTopic.trim() && !isGenerating) {
            onStart(localTopic);
            setLocalTopic(""); // Tự động xóa nội dung sau khi gửi
        }
    };

    return (
        <motion.div
            key="ai-input-bar"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-50"
        >
            <div className="relative flex items-center gap-2 p-1.5 pl-3 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#333] rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <div className="shrink-0">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${isGenerating ? 'bg-purple-50 dark:bg-purple-900/20' : 'bg-gray-50 dark:bg-[#2a2a2a]'}`}>
                        <Sparkles className={`w-4 h-4 ${isGenerating ? 'text-purple-600 animate-spin' : 'text-gray-400'}`} />
                    </div>
                </div>

                {isGenerating ? (
                    <div className="flex-1 px-3 h-10 flex flex-col justify-center gap-1.5">
                        <div className="flex justify-between items-center text-xs font-medium text-purple-600 dark:text-purple-400">
                            <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                                AI đang xử lý...
                            </motion.span>
                            <span>{progress}%</span>
                        </div>
                        <div className="h-1 w-full bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <motion.div className="h-full bg-purple-600" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
                        </div>
                    </div>
                ) : (
                    <input
                        className="flex-1 bg-transparent border-none outline-none h-11 px-2 text-[15px] placeholder:text-gray-400 text-black dark:text-gray-200"
                        placeholder="Nhập chủ đề để AI bắt đầu viết bài (VD: Xu hướng công nghệ 2026)..."
                        value={localTopic}
                        onChange={(e) => setLocalTopic(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                        autoFocus
                    />
                )}

                <div className="flex items-center gap-1 pr-1">
                    {!isGenerating && (
                        <Button size="icon" variant="ghost" className="rounded-full w-8 h-8" onClick={onClose}>
                            <X className="w-4 h-4" />
                        </Button>
                    )}
                    <Button
                        size="icon"
                        className={`rounded-full shrink-0 w-9 h-9 ${localTopic ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-100 dark:bg-[#2a2a2a] text-gray-300 dark:text-gray-600'}`}
                        onClick={handleStart}
                        disabled={!localTopic || isGenerating}
                    >
                        {isGenerating ? <StopCircle className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
