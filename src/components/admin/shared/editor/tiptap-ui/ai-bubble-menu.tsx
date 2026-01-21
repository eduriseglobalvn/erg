"use client";

import { Editor } from '@tiptap/react';
import { useState, FormEvent } from 'react'; // <--- Đã thêm FormEvent
import { Sparkles, ArrowUp, X, RefreshCcw } from 'lucide-react';
import {BubbleMenu} from "@tiptap/react/menus";

interface AIBubbleMenuProps {
    editor: Editor;
    onRefine: (text: string, prompt: string) => Promise<string | null>;
}

export const AIBubbleMenu = ({ editor, onRefine }: AIBubbleMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Hàm kiểm tra khi nào hiển thị menu
    const shouldShow = ({ editor, from, to }: any) => {
        // Chỉ hiện khi có bôi đen (from !== to), không phải ảnh, không phải codeblock
        return from !== to && !editor.isActive('image') && !editor.isActive('codeBlock');
    };

    const handleAiSubmit = async (e: FormEvent) => { // <--- Dùng FormEvent trực tiếp
        e.preventDefault();
        if (!prompt.trim()) return;

        setIsLoading(true);

        try {
            // Lấy text đang bôi đen
            const { from, to } = editor.state.selection;
            const selectedText = editor.state.doc.textBetween(from, to);

            // Gọi API (Hàm này được truyền từ SimpleEditor vào)
            const resultHtml = await onRefine(selectedText, prompt);

            if (resultHtml) {
                // Thay thế text cũ bằng text mới từ AI
                editor.chain().focus().deleteSelection().insertContent(resultHtml).run();
                setIsOpen(false);
                setPrompt('');
            }
        } catch (error) {
            console.error("AI Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <BubbleMenu
            editor={editor}
            // tippyOptions={{ duration: 100, placement: 'bottom-start', zIndex: 99 }}
            shouldShow={shouldShow}
            className="flex w-fit max-w-[500px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-zinc-900"
        >
            {!isOpen ? (
                // MODE 1: Nút kích hoạt (Hiện khi bôi đen)
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20 bg-white dark:bg-zinc-900 transition-colors"
                >
                    <Sparkles className="h-4 w-4" />
                    Ask AI...
                </button>
            ) : (
                // MODE 2: Input nhập lệnh
                <form onSubmit={handleAiSubmit} className="flex w-[350px] items-center gap-2 p-2 bg-white dark:bg-zinc-900">
                    <Sparkles className="h-4 w-4 text-purple-500 shrink-0" />
                    <input
                        autoFocus
                        disabled={isLoading}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Tell AI what to change..."
                        className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400 text-black dark:text-white"
                    />
                    {isLoading ? (
                        <RefreshCcw className="h-3 w-3 animate-spin text-gray-400" />
                    ) : (
                        <button type="submit" className="rounded-full bg-purple-600 p-1 text-white hover:bg-purple-700 flex items-center justify-center">
                            <ArrowUp className="h-3 w-3" />
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="text-gray-400 hover:text-red-500 transition-colors ml-1"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </form>
            )}
        </BubbleMenu>
    );
};