"use client"

import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { aiApi, postsApi } from '@/services';

// 1. Định nghĩa lại kiểu dữ liệu trả về cho chắc chắn
// (Khớp với JSON: { statusCode: 200, data: { ... } })
interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data: T;
}

interface AiStatusData {
    id: string;
    state: 'waiting' | 'active' | 'completed' | 'failed';
    progress: number;
    result?: {
        postId: string;
        slug?: string;
    };
}

export function useAiWriter(editor: any) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isRefining, setIsRefining] = useState(false);
    const [progress, setProgress] = useState(0);

    // FIX LỖI 1: Dùng 'any' cho interval để tránh xung đột kiểu giữa Node và Browser
    const intervalRef = useRef<any>(null);

    // --- HÀM MÔ PHỎNG HIỆU ỨNG GÕ CHỮ (NÂNG CẤP: CHUẨN ĐỊNH DẠNG) ---
    const typeIntoEditor = async (html: string, editor: any) => {
        if (!editor || !html) return;

        // 1. Xóa trắng editor
        editor.commands.setContent('');

        // 2. Parse HTML thành các khối (blocks)
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        // Lấy tất cả các con trực tiếp của body (p, h2, figure, ...)
        const blocks = Array.from(doc.body.childNodes);

        for (const node of blocks) {
            // Loại bỏ text node chỉ chứa khoảng trắng/newline thừa
            if (node.nodeType === Node.TEXT_NODE && !node.textContent?.trim()) continue;

            const content = node.nodeType === Node.TEXT_NODE
                ? node.textContent
                : (node as HTMLElement).outerHTML;

            if (content) {
                // Chèn khối nguyên vẹn để không bị hỏng thẻ HTML
                editor.commands.insertContent(content);

                // Delay nhẹ giữa các khối để tạo hiệu ứng streaming
                await new Promise(r => setTimeout(r, 400));

                // Tự động cuộn
                const editorEl = editor.options.element;
                if (editorEl) {
                    const scrollContainer = editorEl.closest('.overflow-y-auto');
                    if (scrollContainer) {
                        scrollContainer.scrollTo({
                            top: scrollContainer.scrollHeight,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        }
    };

    const generateFullPost = async (topic: string, categoryId: string, onSuccess: (data: any) => void) => {
        setIsGenerating(true);
        setProgress(5);
        const toastId = toast.loading('AI đang lên ý tưởng...');

        try {
            const res: any = await aiApi.generate({ topic, categoryId });
            const jobId = res?.data?.jobId || res?.jobId;

            if (!jobId) throw new Error("Không lấy được Job ID từ Server");

            intervalRef.current = setInterval(async () => {
                try {
                    const resStatus = await aiApi.checkStatus(jobId) as any;

                    // Kiểm tra lỗi từ phía Server (nếu không phải 200/201...)
                    if (!resStatus || (resStatus.status && resStatus.status >= 400)) {
                        throw new Error(resStatus.message || "Lỗi khi kiểm tra trạng thái AI");
                    }

                    const statusData = resStatus.data || resStatus;

                    if (statusData.progress) setProgress(statusData.progress);

                    if (statusData.state === 'completed') {
                        clearInterval(intervalRef.current);
                        setProgress(95);

                        const postId = statusData.result?.postId;
                        if (!postId) throw new Error("Không tìm thấy nội dung bài viết sau khi xử lý");

                        const postRes: any = await postsApi.getOne(postId);
                        if (!postRes || (postRes.status && postRes.status >= 400)) {
                            throw new Error("Không thể lấy dữ liệu bài viết đã tạo");
                        }

                        const actualPostData = postRes.data || postRes;

                        // === BẮT ĐẦU QUY TRÌNH HIỂN THỊ ===
                        toast.dismiss(toastId);
                        toast.success('AI đã viết xong, đang trình bày...');

                        // 1. Cập nhật Title và Metadata NGAY LẬP TỨC
                        onSuccess(actualPostData);

                        // 2. Thực hiện gõ vào editor (hiệu ứng chảy chữ)
                        if (editor && actualPostData.content) {
                            await typeIntoEditor(actualPostData.content, editor);
                        }

                        setProgress(100);
                        setIsGenerating(false);
                    }
                    else if (statusData.state === 'failed') {
                        clearInterval(intervalRef.current);
                        toast.dismiss(toastId);
                        toast.error(statusData.error || 'AI gặp lỗi trong quá trình xử lý');
                        setIsGenerating(false);
                    }
                } catch (err: any) {
                    console.error("Polling error:", err);
                    clearInterval(intervalRef.current);
                    toast.dismiss(toastId);
                    toast.error(err.message || 'Lỗi khi đồng bộ kết quả AI');
                    setIsGenerating(false);
                }
            }, 5000); // Tăng lên 5s để nhẹ server tối đa theo yêu cầu từ USER

        } catch (error: any) {
            console.error(error);
            toast.dismiss(toastId);
            toast.error(error.message || 'Lỗi kết nối AI');
            setIsGenerating(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
    };

    const refineText = async (originalText: string, instruction: string) => {
        setIsRefining(true);
        try {
            const res: any = await aiApi.refine({ text: originalText, instruction });
            return res.data?.refinedContent || res.refinedContent || res.result;
        } catch (e) {
            console.error(e);
            toast.error('Lỗi kết nối AI');
            return null;
        } finally {
            setIsRefining(false);
        }
    };

    return {
        isGenerating,
        isRefining,
        progress,
        generateFullPost,
        refineText
    };
}