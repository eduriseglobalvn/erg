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
    const [progress, setProgress] = useState(0);

    // FIX LỖI 1: Dùng 'any' cho interval để tránh xung đột kiểu giữa Node và Browser
    const intervalRef = useRef<any>(null);

    const generateFullPost = async (topic: string, categoryId: string, onSuccess: (data: any) => void) => {
        setIsGenerating(true);
        setProgress(5);
        const toastId = toast.loading('AI đang lên ý tưởng...');

        try {
            // A. Gọi API tạo Job
            // Response có thể là { jobId: "..." } hoặc { data: { jobId: "..." } }
            const res: any = await aiApi.generate({ topic, categoryId });

            // Lấy jobId an toàn
            const jobId = res?.data?.jobId || res?.jobId;

            if (!jobId) throw new Error("Không lấy được Job ID từ Server");

            // B. Polling (Hỏi server liên tục)
            intervalRef.current = setInterval(async () => {
                try {
                    // Gọi API check status
                    // Ép kiểu về 'any' trước để tránh TS bắt bẻ, sau đó ép về Interface chuẩn
                    const resStatus = await aiApi.checkStatus(jobId) as unknown as ApiResponse<AiStatusData>;

                    // Lấy cục data ra (Đây là chỗ hay bị lỗi đỏ nhất)
                    const statusData = resStatus.data || (resStatus as any);

                    // Cập nhật tiến độ
                    if (statusData.progress) setProgress(statusData.progress);

                    // C. Xử lý Hoàn thành
                    if (statusData.state === 'completed') {
                        clearInterval(intervalRef.current);
                        setProgress(95);

                        // 1. Lấy Post ID
                        const postId = statusData.result?.postId;
                        if (!postId) throw new Error("Không tìm thấy Post ID trong kết quả AI");

                        // 2. Gọi API lấy chi tiết bài viết
                        // Ép kiểu 'any' cho postRes để linh hoạt lấy .data
                        const postRes: any = await postsApi.getOne(postId);

                        // Lấy dữ liệu bài viết thật (Title, Content...)
                        const actualPostData = postRes.data || postRes;

                        setProgress(100);
                        toast.dismiss(toastId);
                        toast.success('AI đã viết xong!');

                        // 3. Truyền dữ liệu ra ngoài
                        onSuccess(actualPostData);

                        setIsGenerating(false);
                    }
                    // D. Xử lý Thất bại
                    else if (statusData.state === 'failed') {
                        clearInterval(intervalRef.current);
                        toast.dismiss(toastId);
                        toast.error('AI gặp lỗi trong quá trình xử lý');
                        setIsGenerating(false);
                    }
                } catch (err) {
                    // Lỗi mạng khi polling thì bỏ qua, chờ lần sau gọi tiếp
                    console.warn("Polling error:", err);
                }
            }, 2000);

        } catch (error: any) {
            console.error(error);
            toast.dismiss(toastId);
            toast.error(error.message || 'Lỗi kết nối AI');
            setIsGenerating(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
    };

    const refineText = async (originalText: string, instruction: string) => {
        try {
            const res: any = await aiApi.refine({ text: originalText, instruction });
            // Lấy kết quả linh hoạt (dù backend trả về kiểu gì cũng bắt được)
            return res.result || res.data?.result;
        } catch (e) {
            console.error(e);
            toast.error('Lỗi kết nối AI');
            return null;
        }
    };

    return {
        isGenerating,
        progress,
        generateFullPost,
        refineText
    };
}